import { useCallback, useMemo } from 'react';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pipe } from 'lodash/fp';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Api from '@libs/Api';
import useCpInfo from '@src/hooks/useCpInfo';
import { useModal } from '@src/hooks/useModal';
import useQueryParams from '@src/hooks/useQueryParams';
import { CodeValue, EnumObject, enumStore } from '@zustand/enumStore';

const TARGET_ENUM_KEYS: Array<keyof EnumObject> = [
  'CategoryType',
  'SftAdminType',
  'BodyAlignmentType',
  'RomType',
  'RecommendAgeType',
  'LevelType',
  'ExerciseIntensityType',
  'EquipmentType',
  'PositionType',
  'BodyPartForRoutineType',
  'ExceptionBodyPartType',
  'ExceptionDiseaseType',
  'ExercisePurposeType',
  'SubCategoryType',
  'ContentsStorageLocationType',
];

const SUB_CATEGORY_WHITE_LIST = Object.freeze({
  MCT000: ['SCT000', 'SCT001', 'SCT002', 'SCT004'],
  MCT001: ['SCT000', 'SCT001', 'SCT002', 'SCT004'],
  MCT002: ['SCT003', 'SCT005', 'SCT006', 'SCT007'],
  MCT003: ['SCT000', 'SCT001', 'SCT002', 'SCT004'],
});

export interface RoutineInfo {
  [key: string]: string | string[] | number | boolean | (string | boolean)[] | object | undefined;
  /** 상수로 들어가는 필수 파라미터 우리 잘못아님 이렇게 보내달래요 */
  contentsId: number;
  /** 상수로 들어가는 필수 파라미터 우리 잘못아님 이렇게 보내달래요 */
  exerciseNum: number;
  /** 상수로 들어가는 필수 파라미터 우리 잘못아님 이렇게 보내달래요 */
  exerciseType: string;
  /** 상수로 들어가는 필수 파라미터 우리 잘못아님 이렇게 보내달래요 */
  exerciseOrder: number;
  /** 썸네일 파일 데이터 */
  contentsImageFile: ContentsFileS3;
  /** 비디오 파일 데이터 */
  contentsRoutineFile: ContentsFileS3;
  /** 카테고리 */
  categoryType: string;
  /** 신체능력평가 종류 */
  sftType: Array<string | boolean>;
  /** 체형분석 종류 */
  alignmentType: Array<string | boolean>;
  /** 권장 연령대 */
  recommendAgeType: Array<string | boolean> | string;
  /** 난이도 */
  levelType: string;
  /** 운동 강도 */
  exerciseIntensityType: string;
  /** 사용 기구 */
  equipmentType: Array<string | boolean>;
  /** 포지션 */
  positionType: Array<string | boolean>;
  /** 신체부위 */
  bodyPartType: Array<string | boolean>;
  /** 예외 대상 1(신체부위) */
  exceptionBodyPartType: Array<string | boolean>;
  /** 예외 대상 2(질환명) */
  exceptionDiseaseType: Array<string | boolean>;
  /** 운동목적 */
  exercisePurposeType: Array<string | boolean>;
  /** 관절가동범위 */
  romType: Array<string | boolean>;
  /** routine컨텐츠 승인상태 */
  routineApprovalStatusType: string;
}

export interface ContentsFileS3 {
  fileUrl: string;
  fileId: number;
  fileLocation: string;
  fileSize: number;
  fileType: string;
  originalFileName: string;
  playTime: number;
  realFileName: string;
  registDate: string;
  registUser: string;
  registUtc: string;
  useYn: boolean;
}
export interface ContentsInfo {
  contentsDetailList: { contentsName: string; languageType: string }[];
  mainCategoryType: string;
  subCategoryType: string[] | string;
  contentsStorageLocation: string;
  registDate?: string;
  contentsInfo?: number;
}

export interface RoutineDetailItem {
  muscle: string[] | string;
  exerciseEffect: string;
  actionDescription: string;
  languageType: string;
}

export interface RegistParams {
  contentsInfo: ContentsInfo;
  routineDetailList: RoutineDetailItem[];
  routineInfo: RoutineInfo;
}

export interface CpManagement {
  mainCategory?: string;
}

export interface CpManageDetail {
  cpName?: string;
}

export interface FormValues {
  routineInfo: RoutineInfo;
  contentsInfo: ContentsInfo;
  routineDetailList: RoutineDetailItem[];
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
interface CPContentItem {
  categoryType: string;
  contentsInfoId: string;
  contentsName: string;
  cpName: string;
  exerciseIntensity: string;
  level: string;
  mainCategory: string;
  outdoorApprovalStatusType: string | null;
  recommendAge: string;
  registDate: string;
  routineApprovalStatus: string;
  subCategory: string[];
}
interface CPContentListResponse extends CommonInfo {
  content: CPContentItem[];
}
export interface FormattedCPContent extends Omit<CPContentItem, 'subCategory'> {
  subCategory: string;
}
type ValueOf<T> = T[keyof T];

export interface ContentsInfoId {
  contentsInfoId: number;
}

const dataFormatterForTable = (response: CPContentListResponse) => {
  return {
    result: response.content,
    total: Number(response.totalElements),
  };
};

const dateFormatter = (data: ReturnType<typeof dataFormatterForTable>) => {
  const result = data.result.map((cp) => {
    const registDate = new Date(cp.registDate).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return { ...cp, registDate };
  });

  return { result, total: data.total };
};

// NOTE subCategory가 2개 이상일 수 없는 것으로 알고 있으며, 변경 시 로직 변경 필요
const flatSubCategory = (data: ReturnType<typeof dataFormatterForTable>) => {
  const result = data.result.map((cp) => {
    const subCategory = cp.subCategory.join('');
    return { ...cp, subCategory };
  });

  return { result, total: data.total };
};

const useContentsCP = () => {
  const { id } = useParams();
  const hasId = id !== undefined;
  const navigate = useNavigate();
  const location = useLocation();
  const { clearModal } = useModal();
  const { getEnumListByKeyList, convertEnum } = enumStore();
  const queryClient = useQueryClient();
  const { getAllQueryParams } = useQueryParams();
  const queryParams = getAllQueryParams();

  const { cpManagement, cpManageDetail } = useCpInfo() as {
    cpManagement: CpManagement;
    cpManageDetail: CpManageDetail;
  };
  const [
    categoryTypeEnumList,
    sftAdminTypeEnumList,
    bodyAlignmentTypeEnumList,
    romTypeEnumList,
    recommendAgeTypeEnumList,
    levelTypeEnumList,
    exerciseIntensityTypeEnumList,
    equipmentTypeEnumList,
    positionTypeEnumList,
    bodyPartTypeEnumList,
    exceptionBodyPartTypeEnumList,
    exceptionDiseaseTypeEnumList,
    exercisePurposeTypeEnumList,
    subCategoryTypeEnumList,
    contentStorageLocationEnumList,
  ] = getEnumListByKeyList(TARGET_ENUM_KEYS);

  const filteredSubCategoryEnumList = useMemo(() => {
    const mainCategory = cpManagement?.mainCategory;
    if (!mainCategory || !(mainCategory in SUB_CATEGORY_WHITE_LIST)) return [];

    return subCategoryTypeEnumList?.filter((subCategoryEnum) =>
      SUB_CATEGORY_WHITE_LIST[mainCategory as keyof typeof SUB_CATEGORY_WHITE_LIST]?.includes(subCategoryEnum.code)
    );
  }, [subCategoryTypeEnumList, cpManagement]);

  const enumList = {
    categoryTypeEnumList,
    sftAdminTypeEnumList,
    bodyAlignmentTypeEnumList,
    romTypeEnumList,
    recommendAgeTypeEnumList,
    levelTypeEnumList,
    exerciseIntensityTypeEnumList,
    equipmentTypeEnumList,
    positionTypeEnumList,
    bodyPartTypeEnumList,
    exceptionBodyPartTypeEnumList,
    exceptionDiseaseTypeEnumList,
    exercisePurposeTypeEnumList,
    contentStorageLocationEnumList,
    filteredSubCategoryEnumList,
  };

  const cpData = {
    cpName: cpManageDetail?.cpName,
    mainCategoryValue: convertEnum(cpManagement?.mainCategory || '') ?? '',
  };

  const queryParamsObject = Object.fromEntries(queryParams.entries());
  const { data: listData } = useQuery<CPContentListResponse, Error>({
    queryKey: ['contentsRoutine', queryParamsObject],
    queryFn: async () => {
      const response = await Api.get<CPContentListResponse>(`/v1/admin/program/contents/routine/list`, {
        config: { params: queryParamsObject },
      });
      return response.data;
    },
    enabled: !hasId,
    placeholderData: keepPreviousData,
  });

  const convertAllEnums = (data: { result: FormattedCPContent[]; total: number }) => {
    const result = data.result.map((cp) => {
      const convertedCP: FormattedCPContent = { ...cp };

      (Object.keys(convertedCP) as Array<keyof FormattedCPContent>).forEach((key) => {
        const value = convertedCP[key];
        // 승인상태는 값으로 변환하지 않고 코드로 반환함
        if (
          key !== 'routineApprovalStatus' &&
          key !== 'outdoorApprovalStatusType' &&
          (typeof value === 'string' || typeof value === 'number')
        ) {
          const convertedValue = convertEnum(value.toString());
          (convertedCP[key] as ValueOf<FormattedCPContent>) = convertedValue as ValueOf<FormattedCPContent>;
        }
      });

      return convertedCP;
    });

    return { result, total: data.total };
  };

  const CPResponseTransformer = pipe(dataFormatterForTable, dateFormatter, flatSubCategory, convertAllEnums);

  const { data: itemData } = useQuery<FormValues, Error>({
    queryKey: ['contentsRoutine', id],
    queryFn: async () => {
      const response = await Api.get<FormValues>(`/v1/admin/program/contents/routine/${id}`);

      return response.data;
    },
    enabled: hasId,
  });

  const registMutation = useMutation<void, Error, RegistParams>({
    mutationFn: async (params: RegistParams) => {
      await Api.post('v1/admin/program/contents/routine/regist', { data: params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentsRoutine', queryParamsObject] });
      navigate('/cp');
      clearModal();
    },
  });

  const handleSubmitRoutine = useCallback(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: any) => {
      const serverRoutineInfo = itemData?.routineInfo || {};
      const serverContentsInfo = itemData?.contentsInfo || { contentsDetailList: [] };
      const serverRoutineDetailList = itemData?.routineDetailList || [];
      const {
        routineInfo: updateRoutineInfo,
        contentsInfo: updateContentsInfo,
        routineDetailList: updateRoutineDetailList,
      } = data;

      const filteredRoutineInfo = Object.keys(updateRoutineInfo).reduce<RoutineInfo>((acc, key) => {
        if (Array.isArray(updateRoutineInfo[key])) {
          acc[key] = updateRoutineInfo[key].filter((item) => item);
        } else if (updateRoutineInfo[key]) {
          acc[key] = updateRoutineInfo[key];
        }
        return acc;
      }, {} as RoutineInfo);

      const params = {
        contentsInfo: {
          ...serverContentsInfo,
          contentsDetailList: [
            {
              ...serverContentsInfo.contentsDetailList?.[0],
              contentsName: updateContentsInfo.contentsDetailList[0].contentsName,
              languageType: 'KR',
            },
          ],
          mainCategoryType: cpManagement?.mainCategory ?? '',
          subCategoryType: [updateContentsInfo.subCategoryType] as unknown as string[],
          contentsStorageLocation: updateContentsInfo.contentsStorageLocation,
        },
        routineDetailList: [
          {
            ...serverRoutineDetailList[0],
            muscle: [updateRoutineDetailList[0].muscle] as unknown as string[],
            exerciseEffect: updateRoutineDetailList[0].exerciseEffect,
            actionDescription: updateRoutineDetailList[0].actionDescription,
            languageType: 'KR',
          },
        ],
        routineInfo: {
          ...serverRoutineInfo,
          ...filteredRoutineInfo,
          /** NOTE[CS] 현재 값이 없어 그냥 상수로 써야 함 */
          contentsId: 202,
          exerciseNum: 22,
          exerciseType: 'ET000', // NOTE: exerciseTypeA enum
          exerciseOrder: 3,
          /** NOTE[CS] 현재 값이 없어 그냥 상수로 써야 함 */
          routineApprovalStatusType: updateRoutineInfo.routineApprovalStatusType ?? 'RAS999',
        },
      };
      console.log('###params <== 업데이트 시 데이터 망가짐 스웨거에서도 데이터 망가짐 동작 안됨 ㅇㅇ;', params);
      registMutation.mutateAsync(params); // <== 업데이트 시 데이터 망가짐 스웨거에서도 데이터 망가짐 동작 안됨 ㅇㅇ;
    },
    [cpManagement, registMutation, itemData]
  );

  const transformServerDataToFormData = useCallback(
    (data: FormValues) => {
      const { contentsInfo, routineInfo, routineDetailList } = data;
      const mainCategoryTypeValue = convertEnum(contentsInfo.mainCategoryType);

      const transformToSelectbox = (targetData: string[], targetEnum: CodeValue[]) => {
        const selectboxArray = new Array<string | boolean>(targetEnum.length).fill(false);
        targetData.forEach((value) => {
          const indexString = value.slice(-3);
          const targetIndex = parseInt(indexString, 10);
          selectboxArray[targetIndex] = value;
        });
        return selectboxArray;
      };

      const transformedContentsInfo: ContentsInfo = {
        contentsDetailList: [
          {
            contentsName: contentsInfo.contentsDetailList[0]?.contentsName || '',
            languageType: 'KR',
          },
        ],
        mainCategoryType: mainCategoryTypeValue,
        subCategoryType: contentsInfo.subCategoryType[0],
        contentsStorageLocation: contentsInfo.contentsStorageLocation,
      };

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ensureStringArray = (value: any): string[] => {
        if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
          return value as string[];
        }
        return [];
      };

      const transformedRoutineInfo: RoutineInfo = {
        ...routineInfo,
        sftType: transformToSelectbox(ensureStringArray(routineInfo.sftType), sftAdminTypeEnumList),
        alignmentType: transformToSelectbox(ensureStringArray(routineInfo.alignmentType), bodyAlignmentTypeEnumList),
        romType: transformToSelectbox(ensureStringArray(routineInfo.romType), romTypeEnumList),
        equipmentType: transformToSelectbox(ensureStringArray(routineInfo.equipmentType), equipmentTypeEnumList),
        positionType: transformToSelectbox(ensureStringArray(routineInfo.positionType), positionTypeEnumList),
        bodyPartType: transformToSelectbox(ensureStringArray(routineInfo.bodyPartType), bodyPartTypeEnumList),
        exceptionBodyPartType: transformToSelectbox(
          ensureStringArray(routineInfo.exceptionBodyPartType),
          exceptionBodyPartTypeEnumList
        ),
        exceptionDiseaseType: transformToSelectbox(
          ensureStringArray(routineInfo.exceptionDiseaseType),
          exceptionDiseaseTypeEnumList
        ),
        exercisePurposeType: transformToSelectbox(
          ensureStringArray(routineInfo.exercisePurposeType),
          exercisePurposeTypeEnumList
        ),
      };

      const transformedRoutineDetailList: RoutineDetailItem[] = [
        {
          muscle: routineDetailList[0]?.muscle[0] || '',
          exerciseEffect: routineDetailList[0]?.exerciseEffect || '',
          actionDescription: routineDetailList[0]?.actionDescription || '',
          languageType: 'KR',
        },
      ];

      return {
        contentsInfo: transformedContentsInfo,
        routineInfo: transformedRoutineInfo,
        routineDetailList: transformedRoutineDetailList,
      };
    },
    [
      sftAdminTypeEnumList,
      bodyAlignmentTypeEnumList,
      romTypeEnumList,
      equipmentTypeEnumList,
      positionTypeEnumList,
      bodyPartTypeEnumList,
      exceptionBodyPartTypeEnumList,
      exceptionDiseaseTypeEnumList,
      exercisePurposeTypeEnumList,
      convertEnum,
    ]
  );
  const routineData = useMemo(() => {
    const isEdit = location?.pathname.includes('edit');
    if (itemData && hasId) {
      return isEdit ? transformServerDataToFormData(itemData) : itemData;
    }
  }, [itemData, transformServerDataToFormData, hasId, location]);

  const routineListData = useMemo(() => {
    if (listData && !hasId) {
      return CPResponseTransformer(listData);
    } else {
      return { result: [], total: 0 };
    }
  }, [listData, CPResponseTransformer, hasId]);

  const putApprovalReqMutation = useMutation<void, Error, ContentsInfoId>({
    mutationFn: async (params: ContentsInfoId) => {
      await Api.put(`v1/admin/program/contents/${params.contentsInfoId}/reqApproval`, { data: params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentsRoutine', queryParamsObject] });
      navigate('/contents/cp');
      clearModal();
    },
  });
  const putApprovalConfirmMutation = useMutation<void, Error, ContentsInfoId>({
    mutationFn: async (params: ContentsInfoId) => {
      await Api.put(`v1/admin/program/contents/${params.contentsInfoId}/approval`, { data: params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentsRoutine', queryParamsObject] });
      navigate('/contents/cp');
      clearModal();
    },
  });
  const putApprovalRejectMutation = useMutation<void, Error, ContentsInfoId>({
    mutationFn: async (params: ContentsInfoId) => {
      await Api.put(`v1/admin/program/contents/${params.contentsInfoId}/refusal`, { data: params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentsRoutine', queryParamsObject] });
      navigate('/contents/cp');
      clearModal();
    },
  });

  const deleteCPContentMutation = useMutation<void, Error, ContentsInfoId>({
    mutationFn: async (params: ContentsInfoId) => {
      await Api.delete(`v1/admin/program/contents/${params.contentsInfoId}`, { data: params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentsRoutine', queryParamsObject] });
      navigate('/contents/cp');
      clearModal();
    },
  });

  return {
    routineData,
    routineListData,
    handleSubmitRoutine,
    enumList,
    cpData,
    handleApprovalReq: putApprovalReqMutation.mutateAsync,
    handleApprovalConfirm: putApprovalConfirmMutation.mutateAsync,
    handleApprovalReject: putApprovalRejectMutation.mutateAsync,
    handleDeleteCPContent: deleteCPContentMutation.mutateAsync,
  };
};

export default useContentsCP;
