import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { UserInfo } from '@src/zustand/userInfoStore';

// 요청 옵션을 정의하는 인터페이스
interface RequestOptions<T = unknown> {
  extraBaseUrl?: string; // 선택적 추가 기본 URL
  params?: T; // 선택적 데이터
  config?: AxiosRequestConfig; // 선택적 Axios 요청 설정
  data?: T;
}

interface LoginData {
  adminId: string;
  adminPw: string;
  adminType: string;
}

interface LoginResponse extends UserInfo {
  // 추가적으로 필요한 필드 정의
}
class Api {
  private static instances: Record<string, AxiosInstance> = {};
  private static tokenMap: Record<string, string | null> = {}; // 각 인스턴스에 대한 토큰을 저장할 맵
  private static refreshTokenMap: Record<string, string | null> = {}; // 각 인스턴스에 대한 리프레시 토큰을 저장할 맵

  private static SERVER_TYPE = Object.freeze({
    LOCALHOST: 'LOCALHOST',
    DEV: 'DEV',
    QA: 'QA',
    PRD: 'PRD',
  });
  private static SERVER_ADDRESS = Object.freeze({
    LOCALHOST: '',
    DEV: 'https://dev-kic-admin.lgeappstv.com',
    QA: 'https://qa-kic-admin.lgeappstv.com',
    PRD: 'PRD_IP_ADDRESS',
  });
  private static CURRENT_SERVER_TYPE = this.SERVER_TYPE.DEV;
  private static CURRENT_SERVER_ADDRESS = this.SERVER_ADDRESS[this.CURRENT_SERVER_TYPE];
  private static BASE_URL = this.CURRENT_SERVER_ADDRESS;
  private static HEADER = {
    GET: { headers: { 'Content-Type': 'application/json' } },
    PUT: { headers: { 'Content-Type': 'application/json' } },
    POST: { headers: { 'Content-Type': 'application/json' } },
    DELETE: { headers: { 'Content-Type': 'application/json' } },
    MULTIPART: { headers: { 'Content-Type': 'multipart/form-data' } },
  };

  static {
    // 생성 시 로컬 스토리지에서 토큰 로드
    this.loadTokens();
  }

  private static loadTokens(): void {
    // 로컬 스토리지에서 각 서버에 대한 토큰을 불러와서 설정
    const serverTypes = Object.keys(this.SERVER_ADDRESS) as Array<keyof typeof this.SERVER_ADDRESS>;

    serverTypes.forEach((serverType) => {
      const accessToken = localStorage.getItem(`authToken_${this.SERVER_ADDRESS[serverType]}`);
      const refreshToken = localStorage.getItem(`refreshToken_${this.SERVER_ADDRESS[serverType]}`);
      if (accessToken) {
        this.tokenMap[this.SERVER_ADDRESS[serverType]] = accessToken;
      }
      if (refreshToken) {
        this.refreshTokenMap[this.SERVER_ADDRESS[serverType]] = refreshToken;
      }
    });
  }

  // 특정 baseURL에 대한 인스턴스를 반환하는 메서드
  private static getInstance(baseURL: string, config?: AxiosRequestConfig): AxiosInstance {
    // ExtraBaseURL이 들어올 시에 인스턴스 추가 생성
    if (!this.instances[baseURL]) {
      // Axios 인스턴스를 처음 생성할 때만 실행
      this.instances[baseURL] = axios.create({
        baseURL,
        timeout: 10000,
        ...config,
      });

      // 요청 인터셉터
      this.instances[baseURL].interceptors.request.use(
        (config) => {
          // 해당 인스턴스에 대한 토큰이 있을 경우 헤더에 추가
          const token = this.tokenMap[baseURL];
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // 응답 인터셉터
      this.instances[baseURL].interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
    return this.instances[baseURL];
  }

  // 로그인 메서드
  public static async login(url: string, options?: RequestOptions<LoginData>): Promise<AxiosResponse<LoginResponse>> {
    const baseURL = options?.extraBaseUrl || this.BASE_URL; // extraBaseUrl이 없을 경우 기본 URL 사용

    const response = await this.get<LoginResponse>(url, options);

    if (response.data.token) {
      // 로그인 성공 시 해당 baseURL에 대한 토큰 저장
      this.tokenMap[baseURL] = response.data.token;
      this.refreshTokenMap[baseURL] = response.data.refreshToken; // 리프레시 토큰 저장
      localStorage.setItem(`authToken_${baseURL}`, response.data.token); // 로컬 스토리지에 액세스 토큰 저장
      localStorage.setItem(`refreshToken_${baseURL}`, response.data.refreshToken); // 로컬 스토리지에 리프레시 토큰 저장
    }

    return response;
  }

  // 로그아웃 메서드 ==> 화면 데이터만 삭제함, 결국에는 Logout API 호출하는 형태로 짜야해유
  public static logout(): void {
    const baseURL = this.BASE_URL;
    delete this.tokenMap[baseURL]; // 인스턴스에서 액세스 토큰 제거
    delete this.refreshTokenMap[baseURL]; // 인스턴스에서 리프레시 토큰 제거
    localStorage.removeItem(`authToken_${baseURL}`); // 로컬 스토리지에서 액세스 토큰 제거
    localStorage.removeItem(`refreshToken_${baseURL}`); // 로컬 스토리지에서 리프레시 토큰 제거
    localStorage.removeItem(`userInfo`); // 로컬 스토리지에서 로그인 유저 정보 제거
  }

  // 리프레시 토큰 메서드
  public static async refreshToken(
    url: string,
    options?: { extraBaseUrl?: string }
  ): Promise<AxiosResponse<LoginResponse>> {
    const baseURL = options?.extraBaseUrl || this.BASE_URL;

    const refreshToken = this.refreshTokenMap[baseURL];
    if (!refreshToken) {
      throw new Error('No refresh token available. Please log in again.');
    }

    const response = await this.post<LoginResponse>(url, { data: { token: refreshToken } });

    if (response.data.token) {
      // 리프레시 성공 시 새 토큰 저장
      this.tokenMap[baseURL] = response.data.token;
      this.refreshTokenMap[baseURL] = response.data.refreshToken; // 새 리프레시 토큰 저장
      localStorage.setItem(`authToken_${baseURL}`, response.data.token); // 로컬 스토리지에 액세스 토큰 저장
      localStorage.setItem(`refreshToken_${baseURL}`, response.data.refreshToken); // 로컬 스토리지에 리프레시 토큰 저장
    }

    return response;
  }

  // 'GET' | 'POST' | 'PUT' | 'DELETE' config 생성 메서드
  private static createConfig(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'MULTIPART',
    options?: RequestOptions
  ): AxiosRequestConfig {
    const baseURL = options?.extraBaseUrl || this.BASE_URL;

    const config: AxiosRequestConfig = {
      ...options?.config,
      ...this.HEADER[method], // 메서드에 맞는 기본 헤더
    };

    // Authorization 헤더 추가
    const token = this.tokenMap[baseURL]; // 현재 baseURL에 대한 토큰 가져오기
    if (token) {
      (config.headers as AxiosHeaders)['Authorization'] = `Bearer ${token}`;
    }

    return config;
  }

  // GET 요청 메서드
  public static get<T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> {
    const config = this.createConfig('GET', options);

    return this.getInstance(options?.extraBaseUrl || this.BASE_URL, config).get<T>(url, {
      ...config,
      ...options,
    });
  }

  // POST 요청 메서드
  public static post<T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> {
    const config = this.createConfig('POST', options);
    return this.getInstance(options?.extraBaseUrl || this.BASE_URL, config).post<T>(url, options?.data, config);
  }

  public static multiPartForm<T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> {
    const config = this.createConfig('MULTIPART', options);

    return this.getInstance(options?.extraBaseUrl || this.BASE_URL, config).post<T>(url, options?.data, config);
  }

  // PUT 요청 메서드
  public static put<T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> {
    const config = this.createConfig('PUT', options);

    return this.getInstance(options?.extraBaseUrl || this.BASE_URL, config).put<T>(url, options?.data, config);
  }

  // DELETE 요청 메서드
  public static delete<T>(url: string, options?: RequestOptions): Promise<AxiosResponse<T>> {
    const config = this.createConfig('DELETE', options);

    return this.getInstance(options?.extraBaseUrl || this.BASE_URL, config).delete<T>(url, config);
  }
}

export default Api;
