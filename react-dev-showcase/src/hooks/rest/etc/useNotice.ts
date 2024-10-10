import { useCallback, useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pipe } from 'lodash/fp';
import { useParams } from 'react-router-dom';

import Api from '@libs/Api';
import useQueryParams from '@src/hooks/useQueryParams';

const BASE_URL = '/v1/api/etc/notice';

export interface RegistParams {
  category: string;
  content: string;
  country: string;
  title: string;
  noticeInfoId?: string | number;
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

export interface INotice {
  noticeInfoId: number;
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

export interface INoticeDetail
  extends Omit<
    INotice,
    'deleteYn' | 'modifyDate' | 'modifyUser' | 'modifyUtc' | 'registDate' | 'registUser' | 'registUtc'
  > {}

interface NoticeListResponse extends CommonInfo {
  content: INotice[];
}

const dataFormatterForTable = (response: NoticeListResponse) => {
  return {
    result: response.content,
    total: Number(response.totalElements),
  };
};

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

const useNotice = () => {
  const queryClient = useQueryClient();
  const { getFilteredQueryParams } = useQueryParams();
  const queryParams = getFilteredQueryParams();
  const { id: noticeInfoId } = useParams();
  const hasId = noticeInfoId !== undefined;

  const NoticeResponseTransformer = pipe(dataFormatterForTable);

  const queryParamsObject = Object.fromEntries(queryParams.entries());
  // NOTE: List
  const {
    data: listData,
    isPending: isListPending,
    isError: isListError,
    error: listError,
  } = useQuery<NoticeListResponse, Error>({
    queryKey: ['notice', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<NoticeListResponse>(`${BASE_URL}/`, {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
    enabled: !hasId,
  });
  // NOTE: Detail
  const { data: detailData } = useQuery<INoticeDetail, Error>({
    queryKey: ['notice', noticeInfoId],
    queryFn: async () => {
      const response = await Api.get<INoticeDetail>(`${BASE_URL}/${noticeInfoId}`);
      return response.data;
    },
    enabled: hasId,
  });

  const deleteMutation = useMutation<void, Error>({
    mutationFn: async () => {
      await Api.delete(`${BASE_URL}/delete/${noticeInfoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notice'] });
    },
  });

  const registMutation = useMutation<void, Error, RegistParams>({
    mutationFn: async (params: RegistParams) => {
      await Api.post(`${BASE_URL}/register`, { data: params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notice'] });
    },
  });

  const handleSubmitDeleteNotice = useCallback(async () => {
    deleteMutation.mutateAsync();
  }, [deleteMutation]);

  const handleSubmitRegistNotice = useCallback(
    async (data: RegistParams) => {
      const { category, content, country, title, noticeInfoId } = data;

      const params = {
        category,
        content,
        country,
        title,
        noticeInfoId: Number(noticeInfoId),
      };

      registMutation.mutateAsync(params);
    },
    [registMutation]
  );

  const noticeDetailData = useMemo(() => {
    if (detailData && hasId) {
      return detailData;
    }
  }, [detailData, hasId]);

  const noticeListData = useMemo(() => {
    if (listData && !hasId) {
      return dateFormatter(NoticeResponseTransformer(listData));
    } else {
      return { result: [], total: 0 };
    }
  }, [listData, hasId, NoticeResponseTransformer]);

  return {
    noticeListData,
    isListPending,
    isListError,
    listError,
    noticeDetailData,
    handleSubmitDeleteNotice,
    handleSubmitRegistNotice,
  };
};

export default useNotice;
