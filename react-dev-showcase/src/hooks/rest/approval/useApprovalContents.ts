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

export interface ApprovalContentsList {
  categoryType: string;
  contentGubun: string;
  contentsInfoId: number;
  contentsName: string;
  cpName: string;
  exerciseIntensityType: string;
  levelType: string;
  mainCategoryType: string;
  recommendAgeType: string;
  registDate: string;
  registUser: string;
  subCategoryType: string;
}

interface ApprovalContentsResponse extends CommonInfo {
  content: ApprovalContentsList[];
}

const dataFormatterForTable = (response: ApprovalContentsResponse) => ({
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

const useApprovalContents = <T extends TableQueryParams = TableQueryParams>() => {
  const { getFilteredQueryParams } = useQueryParams<T>();
  const queryParams = getFilteredQueryParams();
  const queryParamsObject = Object.fromEntries(queryParams.entries());

  // approval pending contents List
  const {
    data: ContentsListData,
    isPending: isContentsListPending,
    isError: isContentsListError,
    error: ContentslistError,
  } = useQuery<ApprovalContentsResponse, Error>({
    queryKey: ['approvalContents', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<ApprovalContentsResponse>('/v1/api/approval/getApprovalContents', {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const processedContentsListData = useMemo(() => {
    if (!ContentsListData) return { result: [], total: 0 };
    return dateFormatter(dataFormatterForTable(ContentsListData));
  }, [ContentsListData]);

  return {
    // approval pending contents List
    processedContentsListData,
    isContentsListPending,
    isContentsListError,
    ContentslistError,
  };
};

export default useApprovalContents;
