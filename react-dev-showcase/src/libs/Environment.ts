// 기본 설정
export const ISDEV = 'development' === (import.meta.env.VITE_NODE_ENV as 'development' | 'production');
export const DEBUG = import.meta.env.VITE_DEBUG === 'true';
export const INTERNAL = import.meta.env.VITE_INTERNAL === 'true';
export const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

// API 서버 도메인
export const API_URL = import.meta.env.VITE_API_URL;
export const API_PORT = parseInt(import.meta.env.VITE_API_PORT, 10);
export const API_KEY = import.meta.env.VITE_API_KEY;

// 인증 서버
export const AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN;
export const AUTH_PORT = parseInt(import.meta.env.VITE_AUTH_PORT, 10);
export const AUTH_JWT_SECRET = import.meta.env.VITE_AUTH_JWT_SECRET;
export const OAUTH_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID;
export const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

// 메일 서버
export const MAIL_HOST = import.meta.env.VITE_MAIL_HOST;
export const MAIL_PORT = parseInt(import.meta.env.VITE_MAIL_PORT, 10);

// 기능 플래그 예제
export const FEATURE_FLAG_X = import.meta.env.VITE_FEATURE_FLAG_X === 'true';

// 로깅 레벨 설정
export const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL;

// 작업 재시도 최대 횟수
export const MAX_RETRY_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_RETRY_ATTEMPTS, 10);

// 파일 업로드 크기 제한
export const UPLOAD_LIMIT = import.meta.env.VITE_UPLOAD_LIMIT;
