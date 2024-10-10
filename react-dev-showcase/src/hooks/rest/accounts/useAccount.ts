import { useCallback, useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pipe } from 'lodash/fp';
import { useParams } from 'react-router-dom';

import Api from '@libs/Api';
import useQueryParams from '@src/hooks/useQueryParams';

const BASE_URL = '/v1/api/accounts';

const STATUS_TYPE = Object.freeze({
  approval: 'approval',
  refusal: 'refusal',
  reqApproval: 'reqApproval',
  delete: 'delete',
});

export type StatusType = keyof typeof STATUS_TYPE;

export interface ApiParams {
  adminInfoId?: string;
  status: string;
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

interface AdminImageFile {
  fileId: number;
  fileType: string;
  fileLocation: string;
  fileUrl: string;
  originalFileName: string;
  realFileName: string;
  playTime: number;
  fileSize: number;
  useYn: boolean;
  registDate: string;
  registUser: string;
  registUtc: string;
}
export interface Accounts {
  adminInfoId: number;
  adminId: string;
  adminName: string;
  adminNickname: string;
  adminCountry: string;
  adminLevelId: number;
  className: string;
  adminApproveStatus: string;
  adminUseStatus: string;
  registDate: string;
}

export interface AccountsDetail extends Omit<Accounts, 'adminApproveStatus' | 'registDate'> {
  adminClassInfoId: number;
  approvalStatus: string;
  approvalAuthority: boolean;
  adminImageFile?: AdminImageFile;
}

export interface AccountListResponse extends CommonInfo {
  content: Accounts[];
}

const dataFormatterForTable = (response: AccountListResponse) => {
  return {
    result: response.content,
    total: Number(response.totalElements),
  };
};

const useAccount = () => {
  const queryClient = useQueryClient();
  const { getFilteredQueryParams } = useQueryParams();
  const queryParams = getFilteredQueryParams();
  const { id: adminInfoId } = useParams();
  const hasId = adminInfoId !== undefined;

  const AccountResponseTransformer = pipe(dataFormatterForTable);

  const queryParamsObject = Object.fromEntries(queryParams.entries());
  const { data: listData } = useQuery<Accounts, Error>({
    queryKey: ['accounts', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<Accounts>(`${BASE_URL}/`, {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
    enabled: !hasId,
  });

  const { data: detailData } = useQuery<AccountsDetail, Error>({
    queryKey: ['accounts', adminInfoId],
    queryFn: async () => {
      const response = await Api.get<AccountsDetail>(`${BASE_URL}/${adminInfoId}`);
      return response.data;
    },
    enabled: hasId,
  });

  const statusMutation = useMutation<void, Error, ApiParams>({
    mutationFn: async ({ status }) => {
      if (status !== STATUS_TYPE.delete) {
        Api.put(`${BASE_URL}/${adminInfoId}/${status}`);
        return;
      }
      Api.delete(`${BASE_URL}/${adminInfoId}/${status}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const handleAccountsApproval = useCallback(
    async (type: StatusType) => {
      const status = STATUS_TYPE[type];
      await statusMutation.mutateAsync({
        status,
        adminInfoId,
      });
    },
    [adminInfoId, statusMutation]
  );

  const accountDetailData = useMemo(() => {
    if (detailData && hasId) {
      return detailData;
    }
  }, [detailData, hasId]);

  const accountListData = useMemo(() => {
    if (listData && !hasId) {
      return AccountResponseTransformer(listData);
    } else {
      return { result: [], total: 0 };
    }
  }, [listData, hasId, AccountResponseTransformer]);

  return {
    accountDetailData,
    accountListData,
    handleAccountsApproval,
  };
};

export default useAccount;
