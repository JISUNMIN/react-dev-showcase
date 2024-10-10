import styled from 'styled-components';

import {
  CloseDarkIcon,
  pagingFirstLeftIcon,
  pagingLastRightIcon,
  pagingLeftIcon,
  pagingRightIcon,
} from '@assets/images';
import { Button, Div, Icon, Text } from '@components/index';
import { convertDateToString } from '@utils/helpers';

interface CalendarHeaderProps {
  /** React-datepicker 현재 날짜 */
  monthDate: Date;
  /** React-datepicker calendar에서 month가 내려가는 함수 */
  decreaseMonth: () => void;
  /** React-datepicker calendar에서 month가 올라가는 함수 */
  increaseMonth: () => void;
  /** React-datepicker calendar에서 year가 내려가는 함수 */
  decreaseYear: () => void;
  /** React-datepicker calendar에서 year가 올라가는 함수 */
  increaseYear: () => void;
  /** React-datepicker calendar에서 open/close를 조절하는 함수 */
  setOpen?: (open: boolean) => void;
}

/** 한 프로젝트에서 공통적으로 스타일 변화없이 쓰이는 요소들을 어떻게 Style 줄지 논의 필요 : 현재 Styled로 고정값 */
const StyledIcon = styled(Icon)`
  width: 30px;
  height: 25px;
`;

const StyledCloseIcon = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const CalendarHeaderContainer = styled(Div)`
  --vertical-gap: 10px;
`;

const CalendarHeaderWrapper = styled(Div)`
  margin-top: var(--vertical-gap);
  padding-bottom: var(--vertical-gap);
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray03};
`;

const CalendarHeaderTitle = styled(Text)`
  font-size: 20px;
  font-weight: 700;
`;

const CalendarCloseButton = styled(Button)`
  position: absolute;
  height: 20px;
  top: 0;
  right: 0;
  border: 0;
  background-color: transparent;
`;

const CalendarDateWrapper = styled(Div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  margin: 0 6.4px;
  padding: 20px 0;
`;

const CalendarButtonWrapper = styled(Div)`
  display: flex;
  align-items: center;
  height: 100%;
`;

const CalendarDate = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray08};
`;

const CalendarDateControlButton = styled(Button)`
  margin: 0;
  padding: 0;
  border: 0;
  background-color: transparent;

  & > img {
    height: 18px;
  }
`;

const CalendarHeader = ({
  monthDate,
  decreaseMonth,
  increaseMonth,
  decreaseYear,
  increaseYear,
  setOpen,
}: CalendarHeaderProps) => {
  const handleCloseButtonClick = () => setOpen && setOpen(false);

  return (
    <CalendarHeaderContainer>
      <CalendarHeaderWrapper>
        <CalendarHeaderTitle>날짜 선택</CalendarHeaderTitle>
        <CalendarCloseButton onClick={handleCloseButtonClick}>
          <StyledCloseIcon icon={CloseDarkIcon} />
        </CalendarCloseButton>
      </CalendarHeaderWrapper>
      <CalendarDateWrapper>
        <CalendarButtonWrapper>
          <CalendarDateControlButton onClick={decreaseYear}>
            <StyledIcon icon={pagingFirstLeftIcon} />
          </CalendarDateControlButton>

          <CalendarDateControlButton onClick={decreaseMonth}>
            <StyledIcon icon={pagingLeftIcon} />
          </CalendarDateControlButton>
        </CalendarButtonWrapper>
        <CalendarDate>{convertDateToString(monthDate, 'ko')}</CalendarDate>
        <CalendarButtonWrapper>
          <CalendarDateControlButton onClick={increaseMonth}>
            <StyledIcon icon={pagingRightIcon} />
          </CalendarDateControlButton>

          <CalendarDateControlButton onClick={increaseYear}>
            <StyledIcon icon={pagingLastRightIcon} />
          </CalendarDateControlButton>
        </CalendarButtonWrapper>
      </CalendarDateWrapper>
    </CalendarHeaderContainer>
  );
};

export default CalendarHeader;
