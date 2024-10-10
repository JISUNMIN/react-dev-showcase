/* eslint-disable @typescript-eslint/no-unused-vars */
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

export interface FaqList {
  faqInfoId: number;
  title: string;
  country: string;
  category: string;
  content: string;
  deleteYn: boolean;
  modifyDate: string;
  modifyUser: string;
  modifyUtc: string;
  registDate: string;
  registUser: string;
  registUtc: string;
}

interface FaqListResponse extends CommonInfo {
  content: FaqList[];
}

interface FaqDetailResponse {
  faqInfoId: number;
  title: string;
  country: string;
  category: string;
  content: string;
}

interface UpdateParams {
  faqInfoId?: number;
  category: string;
  content: string;
  country: string;
  title: string;
}

interface DeleteParams {
  faqInfoId: number;
}

const dataFormatterForTable = (response: FaqListResponse) => ({
  result: response.content,
  total: Number(response.numberOfElements),
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

const useFaq = <T extends TableQueryParams = TableQueryParams>() => {
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
  } = useQuery<FaqListResponse, Error>({
    queryKey: ['faq', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<FaqListResponse>('/v1/api/etc/faq/', {
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

  // Detail
  const { data: detailData, isPending: isDetailPending } = useQuery<FaqDetailResponse, Error>({
    queryKey: ['faqDetail', id],
    queryFn: async () => {
      const response = await Api.get<FaqDetailResponse>(`/v1/api/etc/faq/${id}`, {});
      return response.data;
    },
    enabled: !!id,
  });

  const processedDetailData = useMemo(() => {
    if (!detailData) return {} as FaqDetailResponse;
    return detailData;
  }, [detailData]);

  // Mutation (Register or Update)
  const registMutation = useMutation<void, Error, UpdateParams>({
    mutationFn: async (params: UpdateParams) => {
      await Api.post(`/v1/api/etc/faq/register`, { data: JSON.stringify(params) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });

  // Delete
  const deleteMutation = useMutation<void, Error, DeleteParams>({
    mutationFn: async (params: DeleteParams) => {
      await Api.delete(`/v1/api/etc/faq/delete/${params.faqInfoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });

  return {
    // List
    processedListData,
    isListPending,
    isListError,
    listError,
    // Detail
    processedDetailData,
    isDetailPending,
    // Mutation
    registMutation,
    // deleteMutation
    deleteMutation,
  };
};

export default useFaq;
