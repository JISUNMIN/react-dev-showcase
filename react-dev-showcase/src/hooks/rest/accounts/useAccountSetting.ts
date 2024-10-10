import { useCallback, useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pipe } from 'lodash/fp';
import { useParams } from 'react-router-dom';

import Api from '@libs/Api';
import useQueryParams from '@src/hooks/useQueryParams';

const BASE_URL = '/v1/api/accounts/setting';

export interface UpdateParams {
  adminInfoId?: string;
  adminClassInfoId?: string;
}

export interface RegistParams {
  adminClassInfoId: number;
  accessibleMenu?: Record<string, string> | string[];
  approvalAuthority?: string | boolean;
}

interface Pageable {
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}
interface CommonInfo {
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  size: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface AccountsSetting {
  adminClassInfoId: number;
  className: string;
  approvalAuthority: boolean;
  registDate: string;
}

export interface AccountsSettingDetail {
  className: string;
  approvalAuthority: boolean;
  accessibleMenuList: [{ code: string; value: string }];
}

export interface AccountSettingResponse extends CommonInfo {
  content: AccountsSetting[];
}

const dataFormatterForTable = (response: AccountSettingResponse) => {
  return {
    result: response.content,
    total: Number(response.totalElements),
  };
};

// FIXME: classList api 수정 되기 전 까지 임시 사용
const dataFormatterForClassName = (response: AccountSettingResponse) => {
  return {
    result: response.content,
  };
};

const useAccountSetting = () => {
  const queryClient = useQueryClient();
  const { getFilteredQueryParams } = useQueryParams();
  const queryParams = getFilteredQueryParams();
  const { id: adminClassInfoId } = useParams();
  const hasId = adminClassInfoId !== undefined;

  const AccountSettingResponseTransformer = pipe(dataFormatterForTable);
  const AccountSettingClassNameTransformer = pipe(dataFormatterForClassName);

  const queryParamsObject = Object.fromEntries(queryParams.entries());
  const { data: listData } = useQuery<AccountsSetting, Error>({
    queryKey: ['accountsSetting', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<AccountsSetting>(`${BASE_URL}/list`, {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
  });

  const { data: classListData } = useQuery<AccountsSetting, Error>({
    queryKey: ['accountsSettingClassList', adminClassInfoId],
    queryFn: async () => {
      const response = await Api.get<AccountsSetting>(`${BASE_URL}/list`);
      return response.data;
    },
    enabled: hasId,
  });

  const { data: detailData } = useQuery<AccountsSettingDetail, Error>({
    queryKey: ['accountsSetting', adminClassInfoId],
    queryFn: async () => {
      const response = await Api.get<AccountsSettingDetail>(`${BASE_URL}/${adminClassInfoId}`);
      return response.data;
    },
    enabled: hasId,
  });

  const updateMutation = useMutation<void, Error, UpdateParams>({
    mutationFn: async (params: UpdateParams) => {
      await Api.put(`${BASE_URL}/${params.adminInfoId}`, { data: params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountSetting'] });
    },
  });

  const registMutation = useMutation<void, Error, RegistParams>({
    mutationFn: async (params: RegistParams) => {
      await Api.post(`${BASE_URL}/regist`, { data: params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountSetting'] });
    },
  });

  const deleteMutation = useMutation<void, Error>({
    mutationFn: async () => {
      await Api.delete(`${BASE_URL}/level-setting/${adminClassInfoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountSetting'] });
    },
  });

  const handleSubmitUpdateAccountSetting = useCallback(
    async (data: UpdateParams) => {
      const { adminInfoId, adminClassInfoId } = data;
      const params = {
        adminInfoId,
        adminClassInfoId,
      };
      updateMutation.mutateAsync(params);
    },
    [updateMutation]
  );

  const handleSubmitRegisterAccountSetting = useCallback(
    async (data: RegistParams) => {
      const { accessibleMenu, adminClassInfoId, approvalAuthority } = data;

      const approvalCondition = approvalAuthority === '1';

      const params = {
        accessibleMenu,
        adminClassInfoId,
        approvalAuthority: approvalCondition,
      };
      registMutation.mutateAsync(params);
    },
    [registMutation]
  );

  const handleSubmitDeleteAccountSetting = useCallback(async () => {
    deleteMutation.mutateAsync();
  }, [deleteMutation]);

  const roleDetailData = useMemo(() => {
    if (detailData && hasId) {
      return detailData;
    }
  }, [detailData, hasId]);

  const roleClassListData = useMemo(() => {
    if (classListData && hasId) {
      return AccountSettingClassNameTransformer(classListData);
    }
  }, [classListData, hasId, AccountSettingClassNameTransformer]);

  const roleListData = useMemo(() => {
    if (listData && !hasId) {
      return AccountSettingResponseTransformer(listData);
    } else {
      return { result: [], total: 0 };
    }
  }, [listData, hasId, AccountSettingResponseTransformer]);

  return {
    roleDetailData,
    roleClassListData,
    roleListData,
    handleSubmitUpdateAccountSetting,
    handleSubmitRegisterAccountSetting,
    handleSubmitDeleteAccountSetting,
  };
};

export default useAccountSetting;
