import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pipe } from 'lodash/fp';

import Api from '@libs/Api';
import useQueryParams from '@src/hooks/useQueryParams';

interface Address {
  street: string; // 거리
  city: string; // 도시
  state: string; // 주
  zip: string; // 우편번호
}

interface Phone {
  type: 'home' | 'mobile'; // 전화번호 종류 (집, 모바일)
  number: string; // 전화번호
}

export interface User {
  id: string; // 사용자 ID
  name: string; // 사용자 이름
  email: string; // 사용자 이메일
  age: number; // 사용자 나이
  address: Address; // 주소 정보
  phone: Phone[]; // 전화번호 배열
  occupation: string; // 직업
  bio: string; // 자기소개
  isActive: boolean; // 계정상태
}

interface GetUsers {
  result: User[];
  total: number;
}

const useUsers = <T>() => {
  const queryClient = useQueryClient();
  const { getFilteredQueryParams } = useQueryParams<T>();
  const queryParams = getFilteredQueryParams(['pageSize', 'pageIndex', 'sortColumn', 'sortDirection'] as Array<
    keyof T
  >);
  const queryParamsObject = Object.fromEntries(queryParams.entries());

  const { data, isLoading, isPending, isFetching, isError, error } = useQuery<GetUsers, Error>({
    queryKey: ['users', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<GetUsers>('/user', {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const addUserMutation = useMutation({
    mutationFn: async (newUser: User) => {
      await Api.post('/user', { data: newUser });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      await Api.put(`/user/${updatedUser.id}`, { data: updatedUser });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await Api.delete(`/user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const filterActiveUsers = (users: User[]) => users.filter((user) => user.isActive);

  const sortByAge = (users: User[]) => users.sort((a, b) => a.age - b.age);

  const formatUser = (user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    address: `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zip}`,
    phoneNumbers: user.phone.map((phone) => `${phone.type === 'home' ? 'Home' : 'Mobile'}: ${phone.number}`),
  });

  // 함수합성
  const processUsers = pipe(filterActiveUsers, sortByAge, (users) => users.map(formatUser));

  console.log('####data', data);

  // 로딩, 오류 상태를 반환하고, mutate 함수를 제공
  return {
    data,
    isLoading,
    isPending,
    isFetching,
    isError,
    error,
    addUser: addUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    processUsers,
  };
};

export default useUsers;
