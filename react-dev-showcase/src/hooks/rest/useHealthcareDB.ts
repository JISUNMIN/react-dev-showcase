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

export interface HealthDBList {
  healthCareInfoId: number;
  mainCategoryType: string;
  subCategoryType: string;
  content: string;
  country: string;
  languageType: string;
  healthCareFileId: string;
  versionInfo: string;
  useYn: string;
  deleteYn: boolean;
  registDate: string;
  registUser: string;
  registUtc: string;
}

interface HealthDBListResponse extends CommonInfo {
  content: HealthDBList[];
}

interface HealthDBDetailResponse {
  healthCareInfoId: number;
  mainCategoryType: string;
  subCategoryType: string;
  content: string;
  country: string;
  languageType: string;
  file: null;
  healthCareFile: {
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
  };
  versionInfo: string;
  useYn: boolean;
  deleteYn: boolean;
}

interface UpdateFileParams {
  fileUrl: string;
  useYn: boolean;
}

interface updateDTO {
  healthCareInfoId?: number;
  mainCategoryType: string;
  subCategoryType: string;
  content: string;
  country: string;
  languageType: string;
  healthCareFile: UpdateFileParams;
}
interface UpdateParams {
  healthCareInfoDTO: updateDTO;
  file: FormData;
}

interface DeleteParams {
  healthCareInfoId: number;
}

const dataFormatterForTable = (response: HealthDBListResponse) => ({
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

const useHealthcareDB = <T extends TableQueryParams = TableQueryParams>() => {
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
  } = useQuery<HealthDBListResponse, Error>({
    queryKey: ['health', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<HealthDBListResponse>('/v1/api/etc/health/', {
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
  const { data: detailData, isPending: isDetailPending } = useQuery<HealthDBDetailResponse, Error>({
    queryKey: ['healthDetail', id],
    queryFn: async () => {
      const response = await Api.get<HealthDBDetailResponse>(`/v1/api/etc/health/${id}`, {});
      return response.data;
    },
    enabled: !!id,
  });

  const processedDetailData = useMemo(() => {
    if (!detailData) return {} as HealthDBDetailResponse;
    return detailData;
  }, [detailData]);

  // Mutation (Register or Update)
  const registMutation = useMutation<void, Error, UpdateParams | FormData>({
    mutationFn: async (params: UpdateParams | FormData) => {
      await Api.multiPartForm(`/v1/api/etc/health/register`, { data: params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    },
  });

  // Delete
  const deleteMutation = useMutation<void, Error, DeleteParams>({
    mutationFn: async (params: DeleteParams) => {
      await Api.delete(`/v1/api/etc/health/delete/${params?.healthCareInfoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthDelete'] });
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
    // Delete
    deleteMutation,
  };
};

export default useHealthcareDB;
