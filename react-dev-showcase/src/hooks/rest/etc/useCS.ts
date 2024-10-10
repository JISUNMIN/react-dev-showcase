import { useMemo } from 'react';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

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

export interface CsList {
  csRequestInfoId: number;
  title: string;
  content: string;
  userId: string;
  country: string;
  category: string;
  userTvSpec: string;
  csStatus: string;
  registDate: string;
}

interface CsListResponse extends CommonInfo {
  content: CsList[];
}

interface CsStatus {
  incompleteCount: number;
  completeCount: number;
  totalCount: number;
}

interface CsResonpseList {
  content: string;
  csResponseInfoId: number;
  modifyDate: string;
  registDate: string;
  title: string;
}

interface CsDetailResponse {
  csRequestInfoId: number;
  title: string;
  content: string;
  userId: string;
  country: string;
  category: string;
  userTvSpec: string;
  csStatus: string;
  registDate: string;
  csResponseList: CsResonpseList[];
}

interface CsReply {
  content: string;
  title: string;
}

interface UpdateParams {
  csRequestInfoId?: number;
  csInfoReplyDTO: CsReply;
}

const dataFormatterForTable = (response: CsListResponse) => ({
  result: response.content,
  total: Number(response.totalElements),
});

const dateFormatter = (data: ReturnType<typeof dataFormatterForTable>) => {
  const result = data.result.map((program) => {
    const registDate = new Date(program.registDate).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return { ...program, registDate };
  });
  return { result, total: data.total };
};

const useCS = <T extends TableQueryParams = TableQueryParams>() => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { getFilteredQueryParams } = useQueryParams<T>();
  const queryParams = getFilteredQueryParams();
  const queryParamsObject = Object.fromEntries(queryParams.entries());

  // List
  const {
    data: listData,
    isPending: isListPending,
    isError: isListError,
    error: listError,
  } = useQuery<CsListResponse, Error>({
    queryKey: ['cs', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<CsListResponse>('/v1/api/etc/cs/', {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const processedListData = useMemo(() => {
    if (!listData) return { result: [], total: 0 };
    return dateFormatter(dataFormatterForTable(listData));
  }, [listData]);

  const pageableInfo = useMemo(() => {
    if (!listData) return {} as Pageable;
    return listData.pageable;
  }, [listData]);

  // csStatus
  const { data: statusData, isPending: isStatusPending } = useQuery<CsStatus, Error>({
    queryKey: ['csStatus', id],
    queryFn: async () => {
      const response = await Api.get<CsStatus>(`/v1/api/etc/cs/status-count`);
      return response.data;
    },
  });

  const processedStatusData = useMemo(() => {
    if (!statusData) return {} as CsStatus;
    return statusData;
  }, [statusData]);

  // Detail
  const { data: detailData, isPending: isDetailPending } = useQuery<CsDetailResponse, Error>({
    queryKey: ['csDetail', id],
    queryFn: async () => {
      const response = await Api.get<CsDetailResponse>(`/v1/api/etc/cs/${id}`, {});
      return response.data;
    },
    enabled: !!id,
  });

  const processedDetailData = useMemo(() => {
    if (!detailData) return {} as CsDetailResponse;
    return detailData;
  }, [detailData]);

  // Mutation (Register Answer)
  const registMutation = useMutation<void, Error, UpdateParams>({
    mutationFn: async (params: UpdateParams) => {
      await Api.post(`/v1/api/etc/cs/register/${params.csRequestInfoId}`, {
        data: JSON.stringify(params.csInfoReplyDTO),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cs'] });
    },
  });

  return {
    // List
    processedListData,
    isListPending,
    isListError,
    listError,
    //page
    pageableInfo,
    // csStatus
    processedStatusData,
    isStatusPending,
    // Detail
    processedDetailData,
    isDetailPending,
    // Mutation
    registMutation,
  };
};

export default useCS;
