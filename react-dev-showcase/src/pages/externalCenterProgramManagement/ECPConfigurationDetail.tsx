/** 외부 센터프로그램 관리 > 프로그램 구성 (테이블) / 프로그램 단건 조회 */
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Div, FTAModal, Img, Span, Text } from '@src/components';
import { useModal } from '@src/hooks';
import useProgram from '@src/hooks/rest/useProgram';
import ApprovalButton from '@src/pages/modules/detailButtons/ApprovalButton';
import DeleteButton from '@src/pages/modules/detailButtons/DeleteButton';
import GoToEditButton from '@src/pages/modules/detailButtons/GoToEditButton';
import GoToListButton from '@src/pages/modules/detailButtons/GoToListButton';
import RefusalButton from '@src/pages/modules/detailButtons/RefusalButton';
import ReqApprovalButton from '@src/pages/modules/detailButtons/ReqApprovalButton';
import PATHS from '@src/router/path';
import { flex, font, grid, size } from '@src/styles/variables';
import { enumStore } from '@src/zustand';

import ECPCalendar from './module/ECPCalendar';

interface Session {
  sessionName: string;
  sessionInfo: string;
  /* 요일 정보 */
  daySelect: { [key: string]: boolean | null };
  /* 기간 */
  period: string;
}

const Wrapper = styled(Div)`
  padding: 20px;
`;

const BasicInfoContainer = styled(Div)``;

const SessionInfoContainer = styled(Div)`
  padding: 40px 0;
`;

const GridBox = styled(Div)`
  ${grid({ columns: 'minmax(140px, 1fr) 15fr', gap: '20px', align: 'center' })}
  padding: 24px 0;
`;

const SectionTitleWraper = styled(Div)`
  ${flex({ align: 'start', direction: 'column' })}
  margin-bottom: 40px;

  &:after {
    content: '';
    ${size({ w: '100%', h: '2px' })}
    background-color: ${({ theme }) => theme.colors.gray07};
  }
`;

const SectionTitle = styled(Text)`
  ${font({ size: '22px', weight: '700' })}
  color: ${({ theme }) => theme.colors.gray10};
  padding: 20px 0;
`;

const SessionContainer = styled(Div)`
  padding: 20px;
`;

const SessionTitle = styled(Div)`
  ${font({ weight: '700' })}
  ${grid({ columns: 'minmax(140px, 1fr) 15fr', gap: '20px', align: 'center' })}
  border-top: 1px solid ${({ theme }) => theme.colors.gray04};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray04};
  padding: 20px;
`;

const ItemTitle = styled(Text)`
  display: inline;
  position: relative;
  font-weight: bold;
  word-break: keep-all;
`;

const FilteredChipList = styled(Div)`
  ${flex({ gap: '8px', justify: 'flex-start' })}
  margin-top: 10px;
`;

const ProgramImg = styled(Img)`
  ${size({ w: '150px', h: '150px' })}
  border-radius: 8px;
`;

const ButtonContainer = styled(Div)`
  ${flex({})}
  padding: 50px 0;
`;

const ChipItem = styled(Div)`
  ${flex({ gap: '5px' })}
  padding: 9px 14px;
  border-radius: 56px;
  background-color: ${({ theme }) => theme.colors.green01};
`;

const CalenderInfoContainer = styled(Div)``;

const ExtendModal = styled(FTAModal)`
  z-index: 999;
  position: absolute;
`;

const ECPConfigurationDetail = () => {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModal();

  // const { processedCaldendarData } = useProgram();
  const { processedDetailData } = useProgram();

  const { convertEnum } = enumStore();

  const dayOfWeekMap = ['일', '월', '화', '수', '목', '금', '토'];

  const mapProcessedDataToSessions = (processedData: typeof processedDetailData): Session[] => {
    return processedData?.programSessionList?.map((sessionData) => {
      const daySelect: { [key: string]: boolean | null } = {
        일: null,
        월: null,
        화: null,
        수: null,
        목: null,
        금: null,
        토: null,
      };

      sessionData.dayListOfWeek.forEach((day) => {
        const dayKey = ['일', '월', '화', '수', '목', '금', '토'][day]; // FIXME 1- 월 맞는 지 확인 필요 (요일 별 숫자 확인 필요)
        daySelect[dayKey] = true;
      });

      return {
        sessionName: sessionData.sessionDetailList[0]?.sessionName || '세션 이름 없음',
        sessionInfo: sessionData.sessionDetailList[0]?.sessionDescription || '세션 설명 없음',
        daySelect: daySelect,
        period: sessionData.period.toString(),
      };
    });
  };

  const transformedData = {
    sessions: mapProcessedDataToSessions(processedDetailData),
  };

  const handleApprovalRequestModal = () => {
    showModal(
      <ExtendModal
        key='modal_approvalRequest'
        title='승인 요청'
        handleClose={() => closeModal('modal_approvalRequest')}
        children={
          <>
            <Span>등록한 정보를 승인요청하시겠습니까?</Span>
            <Span>승인 심사 중에는 정보를 수정할 수 없습니다.</Span>
          </>
        }
        footerChildren={
          <>
            <Button>취소</Button>
            <Button>확인</Button>
          </>
        }
      />
    );
  };

  const handleApprovalModal = () => {
    showModal(
      <ExtendModal
        key='modal_approval'
        title='승인 요청'
        handleClose={() => closeModal('modal_approval')}
        children={<Span>등록한 정보를 승인하시겠습니까?</Span>}
        footerChildren={
          <>
            <Button>취소</Button>
            <Button>확인</Button>
          </>
        }
      />
    );
  };

  const handleRejectModal = () => {
    showModal(
      <ExtendModal
        key='modal_reject'
        title='반려'
        handleClose={() => closeModal('modal_reject')}
        children={<Span>등록한 정보를 반려하시겠습니까?</Span>}
        footerChildren={
          <>
            <Button>취소</Button>
            <Button>확인</Button>
          </>
        }
      />
    );
  };

  const handleGoList = () => {
    navigate(`${PATHS.ROOT}${PATHS.ECP_CONFIGURATION}`);
  };

  const handleGoEdit = () => {
    navigate(`${PATHS.ROOT}${PATHS.ECP_PROGRAM_EDIT}/${processedDetailData?.programInfoId}`);
  };

  return (
    <Wrapper>
      {/* 기본 정보 */}
      <BasicInfoContainer>
        <SectionTitleWraper>
          <SectionTitle>기본 정보</SectionTitle>
        </SectionTitleWraper>
        <GridBox>
          <ItemTitle>cp명</ItemTitle>
          <Text>{processedDetailData?.cpInfo?.cpName}</Text>
        </GridBox>
        <GridBox>
          <ItemTitle>프로그램명</ItemTitle>
          <Text>{processedDetailData?.programDetailList?.[0]?.programName}</Text>
        </GridBox>
        <GridBox>
          <ItemTitle>프로그램 이미지</ItemTitle>
          <ProgramImg src={processedDetailData?.file?.fileUrl} />
        </GridBox>
        <GridBox>
          <ItemTitle>소개글</ItemTitle>
          <Text>{processedDetailData?.programDetailList?.[0]?.programDescription}</Text>
        </GridBox>
        <GridBox>
          <ItemTitle>유/무료</ItemTitle>
          <Text>{processedDetailData.priceYn ? '유료' : '무료'}</Text>
        </GridBox>
        <GridBox>
          <ItemTitle>프로그램 정보</ItemTitle>
          <FilteredChipList>
            <ChipItem>{convertEnum(processedDetailData.category || '')}</ChipItem>
            {/** FIXME  해당 code 값과 매치 x  */}
            <ChipItem>{convertEnum(processedDetailData.ageGroup || '')}</ChipItem>
            <ChipItem>{convertEnum(processedDetailData.exerciseTime || '')}</ChipItem>
            <ChipItem>{convertEnum(processedDetailData.exerciseLevel || '')}</ChipItem>
            <ChipItem>{convertEnum(processedDetailData.exerciseIntensity || '')}</ChipItem>
          </FilteredChipList>
        </GridBox>
        <GridBox>
          <ItemTitle>프로그램 노출 여부</ItemTitle>
          <Text>{processedDetailData.exposeYn ? '노출' : '미노출'}</Text>
        </GridBox>
        <GridBox>
          <ItemTitle>국가 / 언어 </ItemTitle>
          <Text>
            {processedDetailData?.programDetailList?.[0]?.languageType}/
            {processedDetailData?.programDetailList?.[0]?.country}
          </Text>
        </GridBox>
      </BasicInfoContainer>
      {/* 운동 세션 정보 */}
      <SessionInfoContainer>
        <SectionTitleWraper>
          <SectionTitle>운동 세션 정보</SectionTitle>
        </SectionTitleWraper>
        <SessionContainer>
          {processedDetailData?.programSessionList?.map((item, index) => (
            <div key={index}>
              <SessionTitle>세션 {index + 1}</SessionTitle>
              <GridBox>
                <ItemTitle>세션명</ItemTitle>
                {item?.sessionDetailList[0]?.sessionName}
              </GridBox>
              <GridBox>
                <ItemTitle>설명</ItemTitle>
                {item?.sessionDetailList[0]?.sessionDescription}
              </GridBox>
              <GridBox>
                <ItemTitle>세션 기간 및 요일 선택</ItemTitle>
                <Div>
                  <Div>{item?.period}주 </Div>
                  <Div> 매주{item?.dayListOfWeek.map((day) => dayOfWeekMap[day]).join(', ')}요일</Div>
                </Div>
              </GridBox>
            </div>
          ))}
        </SessionContainer>
        {/* 프로그램  정보(캘린더)*/}
        <CalenderInfoContainer>
          <SectionTitleWraper>
            <SectionTitle>프로그램 정보</SectionTitle>
          </SectionTitleWraper>
          <ECPCalendar data={transformedData} editYn={false} />
        </CalenderInfoContainer>
      </SessionInfoContainer>

      <ButtonContainer>
        <ReqApprovalButton handleConfirm={handleApprovalRequestModal} />
        <ApprovalButton handleConfirm={handleApprovalModal} />
        <GoToEditButton onClick={handleGoEdit} />
        <RefusalButton handleConfirm={handleRejectModal} />
        <DeleteButton handleConfirm={() => {}} />
        <GoToListButton onClick={handleGoList} />
      </ButtonContainer>
    </Wrapper>
  );
};

export default ECPConfigurationDetail;
