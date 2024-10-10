/** 외부 센터프로그램 관리 > 프로그램 등록 및 조회 시 프로그램 정보 (스케줄링/프로그램 정보) */
import { useCallback } from 'react';

import styled from 'styled-components';

import { Div, Swiper } from '@src/components';
import { FTARoundButton } from '@src/components/service/atoms';
import { flex } from '@src/styles/variables';

interface ECPCalendarProps {
  data: { sessions: Session[] };
  editYn: boolean;
}

interface Session {
  sessionName: string;
  sessionInfo: string;
  daySelect: { [key: string]: boolean | null };
  period: string;
}

interface MappedData {
  [key: string]: { programName: string } | '';
}

const SwiperContainer = styled(Div)``;

const ExtendedSwiper = styled(Swiper)`
  .swiper-button-next {
    top: var(--swiper-navigation-top-offset, 5%);
  }
  .swiper-button-prev {
    top: var(--swiper-navigation-top-offset, 5%);
  }
`;

const SessionTitle = styled(Div)`
  ${flex({})}
  padding: 30px;
`;

const StyledTable = styled.table`
  width: 100%;
  padding: 12px;
  text-align: center;
  border-collapse: collapse;
`;

const Tr = styled.tr`
  border-top: 1px solid ${({ theme }) => theme.colors.gray04};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray04};
`;

const ThDay = styled.th<{ $isActiveDay: boolean }>`
  padding: 20px;
  color: ${({ $isActiveDay, theme }) => ($isActiveDay ? theme.colors.gray10 : theme.colors.gray04)};
`;

const TrSchedule = styled.tr`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray04};
`;

const TdSchedule = styled.td<{ $isActiveDay: boolean }>`
  padding: 12px;
  color: ${({ $isActiveDay, theme }) => ($isActiveDay ? theme.colors.gray10 : theme.colors.gray04)};
`;

const ContentContainer = styled(Div)`
  min-height: 50px;
`;

const ContentBox = styled(Div)`
  ${flex({})}
  color: ${({ theme }) => theme.colors.gray07};
`;

// FIXME: 프로그램 캘린더 api 나오면 수정 필요  ** 작업보류
const ECPCalendar = ({ data, editYn }: ECPCalendarProps) => {
  const handleContentClick = useCallback(() => {
    // FIXME: 컨텐츠 선택 모달 처리
  }, []);

  const mapSessionDatas = (sessions: Session[]): MappedData => {
    const result: MappedData = {
      일요일: '',
      월요일: '',
      화요일: '',
      수요일: '',
      목요일: '',
      금요일: '',
      토요일: '',
    };

    sessions.forEach((session) => {
      Object.entries(session.daySelect).forEach(([day, isSelected]) => {
        if (isSelected) {
          result[`${day}요일`] = { programName: '' }; // FIXME: 실제 프로그램 이름 설정 필요
        }
      });
    });

    return result;
  };

  const TableHeader = (days: string[], session: Session) => (
    <thead>
      <Tr>
        <th>주차</th>
        {days.map((day) => (
          <ThDay key={day} $isActiveDay={session.daySelect[day.slice(0, 1)] ? true : false}>
            {day}
          </ThDay>
        ))}
      </Tr>
    </thead>
  );

  const TableBody = (weeks: number, sessionMappedData: MappedData) => (
    <tbody>
      {[...Array(weeks)].map((_, weekIdx) => (
        <TrSchedule key={weekIdx}>
          <td>{weekIdx + 1}주차</td>
          {Object.values(sessionMappedData).map((schedule, idx) => (
            <TdSchedule key={idx} $isActiveDay={schedule ? true : false}>
              {!schedule ? (
                'Day off'
              ) : (
                <ContentContainer>
                  <ContentBox>
                    {schedule.programName}
                    <FTARoundButton onClick={handleContentClick}>
                      {editYn ? (!schedule.programName ? ' 컨텐츠 추가' : '수정') : '미리보기'}
                    </FTARoundButton>
                  </ContentBox>
                </ContentContainer>
              )}
            </TdSchedule>
          ))}
        </TrSchedule>
      ))}
    </tbody>
  );

  return (
    <Div>
      <SwiperContainer>
        <ExtendedSwiper navigation={true} pagination={false} slidesPerView={1}>
          {data?.sessions?.map((session, index) => {
            const sessionMappedData = mapSessionDatas([session]);
            const numberOfWeeks = parseInt(session.period, 10);

            return (
              <div key={index}>
                <SessionTitle>{session.sessionName}</SessionTitle>
                <StyledTable>
                  {TableHeader(Object.keys(sessionMappedData), session)}
                  {TableBody(numberOfWeeks, sessionMappedData)}
                </StyledTable>
              </div>
            );
          })}
        </ExtendedSwiper>
      </SwiperContainer>
    </Div>
  );
};

export default ECPCalendar;
