import { css } from 'styled-components';

export const CalendarDefaultStyles = css`
  --origin-margin: 0.166rem;

  .react-datepicker {
    font-size: 16px;
    padding: 0px 10px;
  }

  .react-datepicker__day,
  .react-datepicker__day-name,
  .react-datepicker__time-name {
    width: 3rem; /* 셀의 너비 */
    height: 3rem; /* 셀의 높이 */
    line-height: 3rem; /* 셀의 텍스트 높이 */
  }

  // NOTE[CS] header의 weekday 스타일
  .react-datepicker__header {
    background-color: transparent;
    border-style: none;
  }

  .react-datepicker__day-name {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray06};
    margin: calc(var(--origin-margin) / 2) 0;
    padding: calc(var(--origin-margin) / 2) var(--origin-margin);

    &:first-child {
      color: ${({ theme }) => theme.colors.red};
    }
  }

  // NOTE[CS] 각 달력의 날짜 Cell 하나의 스타일
  .react-datepicker__day {
    margin: calc(var(--origin-margin) / 2) 0;
    padding: calc(var(--origin-margin) / 2) var(--origin-margin);
    background-color: transparent;
    font-weight: 600; // FIXME[CS] 만약 해당 폰트에서 font-weight 700이 없다면, 500 낮춰야 함
    color: ${({ theme }) => theme.colors.gray08};

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 50%;
    }
  }

  // NOTE[CS] 선택된 달 이외의 달의 날짜 스타일
  .react-datepicker__day--outside-month {
    color: ${({ theme }) => theme.colors.gray05};
  }

  // NOTE[CS] 오늘 날짜 하이라이트
  .react-datepicker__day--today {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray01};
    background-color: ${({ theme }) => theme.colors.brown02};
    border-radius: 50%;
  }

  // NOTE[CS] children container의 스타일
  .react-datepicker__children-container {
    clear: both;
    width: auto;
  }

  .react-datepicker__day--selected {
    color: ${({ theme }) => theme.colors.brown03};
    background-color: ${({ theme }) => theme.colors.brown01};
    border-radius: 50%;
    font-weight: 700;
  }

  .react-datepicker__day--selected.react-datepicker__day--in-range,
  .react-datepicker__day--selected.react-datepicker__day--in-selecting-range {
    color: ${({ theme }) => theme.colors.brown03};
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
    font-weight: 700;
  }

  .react-datepicker__day--in-range,
  .react-datepicker__day--in-selecting-range {
    color: ${({ theme }) => theme.colors.gray08};
    background-color: ${({ theme }) => theme.colors.brown01};
    border-radius: 0%;
    font-weight: 600;
  }

  .react-datepicker__day--range-end,
  .react-datepicker__day--selecting-range-end {
    color: ${({ theme }) => theme.colors.brown03};
    font-weight: 700;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
  }

  .react-datepicker__day--selecting-range-end:hover {
    background-color: ${({ theme }) => theme.colors.brown01};
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
  }
`;

export const CalendarButtonStyle = css`
  background: ${({ theme }) => theme.colors.gray10};
  color: ${({ theme }) => theme.colors.gray01};
  height: 50px;
  margin: 0;
  padding: 10px 0;
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
`;

export const CalendarDivider = css`
  width: 1px;
  height: 40px;
  opacity: 1;
  background-color: ${({ theme }) => theme.colors.gray03};
`;
