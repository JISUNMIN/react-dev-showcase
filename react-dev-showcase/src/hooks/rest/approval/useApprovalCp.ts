import { useMemo } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import Api from '@libs/Api';
import type { TableQueryParams } from '@src/components/molecules/table/Table';
import useQueryParams from '@src/hooks/useQueryParams';

interface Pageable {
  sort: { unsorted: boolean; sorted: boolean; empty: boolean };
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
  size: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ApprovalCpList {
  contentsCnt: number;
  cpManagementInfoId: number;
  cpName: string;
  mainCategoryType: string;
  priceYn: boolean;
  programCnt: number;
  registDate: string;
  registUser: string;
  subCategoryType: string;
}

interface ApprovalCpResponse extends CommonInfo {
  content: ApprovalCpList[];
}

const dataFormatterForTable = (response: ApprovalCpResponse) => ({
  result: response.content,
  total: Number(response.totalElements),
});

const dateFormatter = (data: ReturnType<typeof dataFormatterForTable>) => {
  const result = data.result.map((approval) => {
    const registDate = new Date(approval.registDate).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return { ...approval, registDate };
  });
  return { result, total: data.total };
};

const useApprovalCp = <T extends TableQueryParams = TableQueryParams>() => {
  const { getFilteredQueryParams } = useQueryParams<T>();
  const queryParams = getFilteredQueryParams();
  const queryParamsObject = Object.fromEntries(queryParams.entries());

  // approval pending cp List
  const {
    data: CpListData,
    isPending: isCpListPending,
    isError: isCpListError,
    error: CplistError,
  } = useQuery<ApprovalCpResponse, Error>({
    queryKey: ['approvalCp', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<ApprovalCpResponse>('/v1/api/approval/getApprovalCp', {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const processedCpListData = useMemo(() => {
    if (!CpListData) return { result: [], total: 0 };
    return dateFormatter(dataFormatterForTable(CpListData));
  }, [CpListData]);

  return {
    //approval pending cp List
    processedCpListData,
    isCpListPending,
    isCpListError,
    CplistError,
  };
};

export default useApprovalCp;
