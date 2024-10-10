import { useMemo } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { pipe } from 'lodash/fp';
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

export interface PROGRAM {
  programDetailList: ProgramDetailList[];
  programInfoId: number;
  programName: string;
  cpName: string;
  priceYn: boolean;
  programDuration: string;
  sessionCount: number;
  scheduleYn: boolean;
  programCompletionStatus: string;
  exposeYn: boolean;
  approvalStatus: string;
  registDate: string;
}

interface ProgramListResponse extends CommonInfo {
  content: PROGRAM[];
}

interface File {
  fileId: number;
  fileType: string;
  fileLocation: string;
  fileUrl: string;
  originalFileName: string;
  realFileName: string;
  playTime: number | null;
  fileSize: number;
  useYn: boolean;
  registDate: string;
  registUser: string;
  registUtc: string;
}

interface ProgramSessionDetail {
  programSessionDetailInfoId: number;
  sessionName: string;
  sessionDescription: string;
  languageType: string;
}

interface ProgramDetailList {
  programName: string;
  programInfoId: number;
  programInfoDetailId: number;
  programDescription: string;
  country: string;
  languageType: string;
  programDetailList: ProgramDetailList[];
}

interface ProgramSession {
  programInfoId: number | null;
  programSessionInfoId: number;
  programSessionOrder: number;
  period: number;
  dayListOfWeek: number[];
  sessionDetailList: ProgramSessionDetail[];
}

interface ProgramCp {
  cpId: number;
  cpName: string;
}

interface ProgramDetailResponse {
  programInfoId: number;
  programType: number;
  cpInfo: ProgramCp;
  programDetailList: ProgramDetailList[];
  file: File;
  priceYn: boolean;
  exposeYn: boolean;
  category: string;
  ageGroup: string;
  exerciseTime: string | null;
  exerciseLevel: string;
  exerciseIntensity: string;
  programSessionList: ProgramSession[];
  approvalStatus: string;
  modifyDate: string;
  modifyUser: string;
  modifyUtc: string;
  registDate: string;
  registUser: string;
  registUtc: string;
  programDuration: string;
  sessionCount: number;
  scheduleYn: boolean;
  programCompletionStatus: string;
}

//program calendar
interface Workout {
  contentsInfoId: number;
  programExerciseInfoId: number;
  contentsName: string | null;
}

interface Day {
  day: number;
  workoutList: Workout[];
}

interface Week {
  week: number;
  dayList: Day[];
}

interface ProgramCalendarResponse {
  schedule: Week[];
}

const dataFormatterForTable = (response: ProgramListResponse) => ({
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

/* const flatData = (data: ReturnType<typeof dataFormatterForTable>) => {
  const result = data.result.map((program) => {
    const programDetailList = program.programDetailList.join('');
    return { ...program, programDetailList };
  });
  return { result, total: data.total };
}; */

const useProgram = <T extends TableQueryParams = TableQueryParams>() => {
  // const ProgramResponseTransformer = pipe(dataFormatterForTable, dateFormatter, flatData);
  const { id } = useParams();
  const { getFilteredQueryParams } = useQueryParams<T>();
  const queryParams = getFilteredQueryParams();
  const queryParamsObject = Object.fromEntries(queryParams.entries());

  // FIXME - 백엔드 에러, 사이즈 3이상으로 보내면 에러나서 임의로 수정, 백엔드 수정 되면 원복 (09.24 기준 이 방법도 호출 불가)
  const temporaryQueryParams = { page: '1', size: '2' };

  // List
  const {
    data: listData,
    isPending: isListPending,
    isError: isListError,
    error: listError,
  } = useQuery<ProgramListResponse, Error>({
    queryKey: ['programs', temporaryQueryParams],
    queryFn: async () => {
      const response = await Api.get<ProgramListResponse>('/v1/admin/program/list', {
        config: { params: temporaryQueryParams },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const processedListData = useMemo(() => {
    if (!listData) return { result: [], total: 0 };
    return dateFormatter(dataFormatterForTable(listData));
  }, [listData]);

  //FIXME - Detail  ** list 조회 불가인데 단건 조회는 75만 가능 나중에 id로 원복
  const { data: detailData, isPending: isDetailPending } = useQuery<ProgramDetailResponse, Error>({
    queryKey: ['programsDetail', '75'],
    queryFn: async () => {
      const response = await Api.get<ProgramDetailResponse>(`/v1/admin/program/75`, {});
      return response.data;
    },
    // enabled: !!id,
  });

  const processedDetailData = useMemo(() => {
    if (!detailData) return {} as ProgramDetailResponse;
    return detailData;
  }, [detailData]);

  // FIXME - calendar 해당 API 맞는 지 확인 필요
  const { data: calendarData, isPending: isCalendarPending } = useQuery<ProgramCalendarResponse[], Error>({
    queryKey: ['programCalendar', '75'],
    queryFn: async () => {
      if (!processedDetailData.programSessionList) return [];
      const promises = processedDetailData.programSessionList.map(async (session) => {
        const response = await Api.get<ProgramCalendarResponse>(
          `/v1/admin/program/schedule/${session.programSessionInfoId}`
        );
        return response.data;
      });
      return Promise.all(promises);
    },
  });

  const processedCaldendarData = useMemo(() => {
    if (!calendarData) return {} as ProgramCalendarResponse;
    return calendarData;
  }, [calendarData]);

  return {
    // List
    processedListData,
    isListPending,
    isListError,
    listError,
    // Detail
    processedDetailData,
    isDetailPending,
    //calendar
    processedCaldendarData,
    isCalendarPending,
  };
};

export default useProgram;
