/** 외부 센터프로그램 관리 > 프로그램 구성 > 등록 (프로그램 정보)*/
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Div } from '@src/components';
import { FTALineButton } from '@src/components/service/atoms';
import { flex } from '@src/styles/variables';

import ECPCalendar from './ECPCalendar';

interface StepProps {
  step: number;
  /* 이전 단계 */
  onPrev: () => void;
  handleSave: () => void;
}

interface FormData {
  programName: string;
  sessions: Session[];
}

interface Session {
  sessionName: string;
  sessionInfo: string;
  /* 요일 정보 */
  daySelect: { [key: string]: boolean | null };
  /* 기간 */
  period: string;
}

const ButtonContainer = styled(Div)`
  ${flex({})}
  z-index: 10;
  position: relative;
`;

const ECPFormStep3 = ({ onPrev, handleSave }: StepProps) => {
  const { getValues } = useFormContext();
  const sessionData = getValues() as FormData;

  return (
    <Div>
      <ECPCalendar data={sessionData} editYn={true} />
      <ButtonContainer>
        <FTALineButton onClick={onPrev}>이전</FTALineButton>
        <FTALineButton onClick={handleSave}>저장</FTALineButton>
      </ButtonContainer>
    </Div>
  );
};

export default ECPFormStep3;
