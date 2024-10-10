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

export interface ApprovalProgramList {
  approvalStatus: string;
  cpName: string;
  exposeYn: boolean;
  priceYn: boolean;
  programCompletionStatus: string;
  programDuration: string;
  programGubun: string;
  programInfoId: number;
  programName: string;
  registDate: string;
  registUser: string;
  scheduleYn: boolean;
  sessionCount: number;
}

interface ApprovalProgramResponse extends CommonInfo {
  content: ApprovalProgramList[];
}

const dataFormatterForTable = (response: ApprovalProgramResponse) => ({
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

const useApprovalProgram = <T extends TableQueryParams = TableQueryParams>() => {
  const { getFilteredQueryParams } = useQueryParams<T>();
  const queryParams = getFilteredQueryParams();
  const queryParamsObject = Object.fromEntries(queryParams.entries());

  // approval pending program List
  const {
    data: ProgramListData,
    isPending: isProgramListPending,
    isError: isProgramListError,
    error: ProgramlistError,
  } = useQuery<ApprovalProgramResponse, Error>({
    queryKey: ['approvalProgram', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<ApprovalProgramResponse>('/v1/api/approval/getApprovalProgram', {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const processedProgramListData = useMemo(() => {
    if (!ProgramListData) return { result: [], total: 0 };
    return dateFormatter(dataFormatterForTable(ProgramListData));
  }, [ProgramListData]);

  return {
    //approval pending program List
    processedProgramListData,
    isProgramListPending,
    isProgramListError,
    ProgramlistError,
  };
};

export default useApprovalProgram;
