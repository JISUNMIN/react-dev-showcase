import { useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pipe } from 'lodash/fp';
import { useNavigate } from 'react-router-dom';

import Api from '@libs/Api';
import type { TableQueryParams } from '@src/components/molecules/table/Table';
import useQueryParams from '@src/hooks/useQueryParams';
import PATHS from '@src/router/path';
import { enumStore } from '@src/zustand';

// NOTE list
// NOTE 이 부분이 실제로 왜 필요한지 모르겠으며, sort는 왜 중복이 되는지도 모르겠음
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

// NOTE "totalElements"만 필요함
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

interface CP {
  approvalStatusType: string;
  cpManagementId: number;
  cpName: string;
  exposeCount: number;
  mainCategory: string;
  motionContentsInfoCount: number;
  outdoorContentsInfoCount: number;
  priceCount: number;
  programName: string;
  registDate: string;
  subCategory: string[];
  contentsCount: number;
}

interface CPListResponse extends CommonInfo {
  content: CP[];
}

export interface FormattedCPList extends Omit<CP, 'subCategory'> {
  subCategory: string;
}

// NOTE detail
interface FileInfo {
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

interface CpManageDetail {
  cpManageInfoId: number;
  cpManageDetailId: number;
  cpName: string;
  introduction: string;
  features: string[];
  languageType: string;
}

interface CPDetailResponse {
  cpManagementInfoId: number;
  mainCategory: string;
  subCategory: string[];
  national: string;
  language: string;
  logoImage: FileInfo;
  introductionImage: FileInfo;
  centerIntroductionImage?: FileInfo;
  exposeYn: boolean;
  approvalStatusType: string;
  cpManageDetailList: CpManageDetail[];
}

export enum RequestStatus {
  APPROVAL = 'approval',
  REFUSAL = 'refusal',
  REQAPPROVAL = 'reqApproval',
}

export interface CPRequestParams
  extends Omit<
    CPDetailResponse,
    'cpManagementInfoId' | 'exposeYn' | 'national' | 'language' | 'approvalStatusType' | 'cpManageDetailList'
  > {
  cpManagementInfoId?: number;
  cpName: string;
  // FIXME interface가 변경되어야 하며, 변경 된 후에 다시 검토해야할 것 같음
  national: {
    id: number;
    item: string;
  };
  language: {
    id: number;
    item: string;
  };
  introduction: string;
  features: Array<{ value: string }>;
  exposeYn: '1' | '0';
}

const BASE_URL = 'v1/api/cpManagement';

const dataFormatterForTable = (response: CPListResponse) => {
  return {
    result: response.content,
    total: Number(response.totalElements),
  };
};

// NOTE utils로 빼도 되지 않을까?
const dateFormatter = (date: Date) => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatDatesInList = (data: ReturnType<typeof dataFormatterForTable>) => {
  const result = data.result.map((cp) => {
    const registDate = dateFormatter(new Date(cp.registDate));
    return { ...cp, registDate };
  });

  return { result, total: data.total };
};

const calculateContentsCount = (data: ReturnType<typeof dataFormatterForTable>) => {
  const result = data.result.map((cp) => {
    const contentsCount = cp.motionContentsInfoCount + cp.outdoorContentsInfoCount;
    return { ...cp, contentsCount };
  });

  return { result, total: data.total };
};

const flatSubCategory = <T extends object>(data: T) => {
  if (!('subCategory' in data) || !Array.isArray(data.subCategory) || data.subCategory.length === 0) {
    return data;
  }

  const subCategory = data.subCategory[0];
  return { ...data, subCategory };
};

// NOTE subCategory가 2개 이상일 수 없는 것으로 알고 있으며, 변경 시 로직 변경 필요
const flatSubCategories = (data: ReturnType<typeof dataFormatterForTable>) => {
  const result = data.result.map((cp) => flatSubCategory(cp)) as unknown[] as FormattedCPList[];

  return { result, total: data.total };
};

const dataFormatterForDetail = (response: CPDetailResponse) => {
  const {
    mainCategory,
    subCategory,
    national,
    language,
    logoImage,
    introductionImage,
    centerIntroductionImage,
    exposeYn,
    approvalStatusType,
    cpManageDetailList: [{ cpName, introduction, features }],
  } = response;

  return {
    mainCategory,
    subCategory,
    national,
    language,
    logoImage,
    introductionImage,
    centerIntroductionImage,
    exposeYn,
    approvalStatusType,
    cpName,
    introduction,
    features,
  };
};

const useCPs = <T extends TableQueryParams = TableQueryParams>(id?: string) => {
  const isUpdate = id != null;
  const queryClient = useQueryClient();
  const { convertEnum } = enumStore();
  const navigate = useNavigate();
  const { getFilteredQueryParams } = useQueryParams<T>();
  const queryParams = getFilteredQueryParams();
  const queryParamsObject = Object.fromEntries(queryParams.entries());

  // NOTE get list
  const {
    data: listData,
    isPending: isListPending,
    isFetching: isListFetching,
  } = useQuery<CPListResponse, Error>({
    queryKey: ['CPs', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<CPListResponse>(`/${BASE_URL}/list`, {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
    enabled: !id,
  });

  // FIXME: flatEnums의 key 값이 단순 숫자(1, 2 등)인 경우가 있어 숫자가 "당일 일정 완료"등으로 노출 됨
  // enum key(code)를 확실하게 unique value로 변경해야 함
  // NOTE utils로 빼도 되지 않을까?
  const convertResponseEnum = <T extends Record<string, unknown>>(data: T) => {
    const convertedData = { ...data };

    Object.keys(convertedData).forEach((key) => {
      const value = convertedData[key];

      if (typeof value === 'string' || typeof value === 'number') {
        const convertedValue = convertEnum(value.toString());
        (convertedData[key] as string | number) = convertedValue;
      }
    });

    return convertedData;
  };

  const convertResponseEnums = <T extends Record<string, unknown>>(data: { result: T[]; total: number }) => {
    const result = data.result.map((cp) => convertResponseEnum(cp));

    return { result, total: data.total };
  };

  const CPListResponseTransformer = pipe(
    dataFormatterForTable,
    formatDatesInList,
    calculateContentsCount,
    flatSubCategories
    // convertResponseEnums
  );

  const processedListData = useMemo(() => {
    if (!listData) {
      return { result: [], total: null };
    }

    return CPListResponseTransformer(listData);
  }, [CPListResponseTransformer, listData]);

  // NOTE get detail
  const { data: detailData, isPending: isDetailPending } = useQuery<CPDetailResponse, Error>({
    queryKey: ['CP', id],
    queryFn: async () => {
      const response = await Api.get<CPDetailResponse>(`/${BASE_URL}/${id}`, {});
      return response.data;
    },
    enabled: !!id,
  });

  const CPDetailResponseTransformer = pipe(dataFormatterForDetail, flatSubCategory, convertResponseEnum);

  const processedDetailData = useMemo<ReturnType<typeof dataFormatterForDetail>>(() => {
    if (!detailData) {
      return {} as ReturnType<typeof dataFormatterForDetail>;
    }

    return CPDetailResponseTransformer(detailData);
  }, [detailData, CPDetailResponseTransformer]);

  // NOTE approval | reject | reqApproval
  const { mutate: approvalMutate } = useMutation({
    mutationFn: async (status: RequestStatus) => {
      await Api.put(`/${BASE_URL}/${id}/${status}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CPs', 'CP'] });
      navigate(`/${PATHS.CP_INFO}`);
    },
  });

  // NOTE 단건 작성 / 수정
  const CPUpdateResponseTransformer = pipe(dataFormatterForDetail);

  const processedUpdateData = useMemo<ReturnType<typeof dataFormatterForDetail>>(() => {
    if (!detailData) {
      return {} as ReturnType<typeof dataFormatterForDetail>;
    }

    return CPUpdateResponseTransformer(detailData);
  }, [detailData, CPUpdateResponseTransformer]);

  const { mutate: registerMutate } = useMutation<void, Error, CPRequestParams>({
    mutationFn: async (data) => {
      await Api.post(`/${BASE_URL}/regist`, {
        data: {
          cpName: data.cpName,
          mainCategory: data.mainCategory,
          subCategory: data.subCategory,
          national: data.national.item,
          language: data.language.item,
          exposeYn: Boolean(Number(data.exposeYn)),
          logoImage: data.logoImage,
          introductionImage: data.introductionImage,
          centerIntroductionImage: data.centerIntroductionImage,
          cpManageDetailList: [
            {
              introduction: data.introduction,
              features: data.features.map(({ value }) => value),
            },
          ],
          // NOTE edit일 때 id 추가
          ...(isUpdate ? { cpManagementInfoId: data.cpManagementInfoId } : {}),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CPs', 'CP'] });
      navigate(`/${PATHS.CP_INFO}`);
    },
  });

  // NOTE delete
  const { mutate: deleteMutate } = useMutation({
    mutationFn: async () => {
      await Api.delete(`/${BASE_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CPs', 'CP'] });
      navigate(`/${PATHS.CP_INFO}`);
    },
  });

  return {
    // list
    listData,
    isListPending,
    isListFetching,
    processedListData,
    // detail
    detailData,
    isDetailPending,
    processedDetailData,
    // mutations
    processedUpdateData,
    approvalMutate,
    registerMutate,
    deleteMutate,
  };
};

export default useCPs;
