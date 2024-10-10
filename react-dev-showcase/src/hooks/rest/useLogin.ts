import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import Api from '@libs/Api';
import PATHS from '@src/router/path';
import { EnumObject, enumStore } from '@zustand/enumStore';
import { UserInfo, userInfoStore } from '@zustand/userInfoStore';

export interface LoginParams {
  adminId: string;
  adminPw: string;
  adminType: 'CP' | 'AM';
}

const fetchLogin = async (params: LoginParams): Promise<UserInfo> => {
  const response = await Api.login('/v1/api/admin/login', {
    params,
  });
  return response.data;
};
const fetchEnum = async (): Promise<EnumObject> => {
  const response = await Api.get<EnumObject>('/v1/api/common/enum/list');
  return response.data;
};

const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserInfo, clearUser } = userInfoStore((state) => ({
    setUserInfo: state.setUserInfo,
    clearUser: state.clearUser,
  }));
  const { setEnum } = enumStore((state) => ({
    setEnum: state.setEnum,
  }));

  const loginMutation = useMutation<UserInfo, Error, LoginParams>({
    mutationFn: fetchLogin,
  });

  const login = async (params: LoginParams) => {
    try {
      // const userData = await loginMutation.mutateAsync(params);
      setUserInfo({
        adminName: 'name',
        adminType: 'CP',
        accessibleMenuList: [],
        token:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDYiLCJpYXQiOjE3MjYxMjcyMzQsImV4cCI6MTcyNzcxOTIzNH0.9qQBkhBQAKV2J5xUn1f3h6bs9xGY-fVVsNfCRRzzBhM',
      });

      const enumData = await fetchEnum();
      setEnum(enumData);

      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (error) {
      console.error('Login or enum fetching failed:', error);
    }
  };

  const logout = () => {
    Api.logout.bind(Api);
    clearUser();
    navigate(`${PATHS.ROOT}${PATHS.LOGIN}`, { state: { from: location } });
  };

  return { login, logout, ...loginMutation };
};

export default useLogin;
