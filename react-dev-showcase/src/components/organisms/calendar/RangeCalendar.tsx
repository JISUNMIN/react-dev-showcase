import { useCallback, useRef } from 'react';

import DatePicker, { DatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useController, useFormContext } from 'react-hook-form';
import styled, { RuleSet, WebTarget } from 'styled-components';

import { Button, CalendarHeader, Div, RangeCalendarDropdown } from '@components/index';
import type { RangeCalendarDropdownProps } from '@src/components/organisms/calendar/RangeCalendarDropdown';
import { useQueryParams } from '@src/hooks';
import { CalendarButtonStyle, CalendarDefaultStyles } from '@src/styles/organisms/Calendar';
import { flex, font } from '@src/styles/variables';
import { convertDateToString, formatDate } from '@utils/helpers';

type RangeCalendarProps = DatePickerProps & {
  /** react-hook-form의 useForm instance에 controller로 등록 할 name */
  name: string;
  /** controller rules */
  required?: boolean;
  /** controller disabled */
  disabled?: boolean;
  /** 옆에 오늘 | 일주일 등 날짜 범위가 선택이 가능한 dropdown의 사용여부 */
  hasDropdown?: boolean;
  /**
   * 달력에 대한 custom style
   *
   * - RangeCalendar : input에 대한 style */
  classes?: {
    RangeCalendar?: RuleSet<object>;
  };
};

interface RequiredDateParams {
  searchStartDate: string;
  searchEndDate: string;
}

const CalendarWrapper = styled(Div)`
  ${CalendarDefaultStyles}
  ${flex({ gap: '6px' })}
  height: 100%;

  .react-datepicker-popper {
    z-index: 2;
  }
`;

const CalendarBox = styled(Div)`
  height: 100%;
`;

const StyledDatePicker = styled<WebTarget & typeof DatePicker>(DatePicker)<{
  $classes?: RangeCalendarProps['classes'];
}>`
  ${font({ size: '16px' })}
  border: 0;
  text-align: center;
  width: 250px;
  padding: 10.5px 18px;
  color: ${({ theme }) => theme.colors.gray08};

  ${({ $classes }) => $classes && $classes.RangeCalendar}
`;

const CalendarButton = styled(Button)`
  ${CalendarButtonStyle}
`;

const DATE_NOW = Date.now();
const SERVICE_CONST = Object.freeze({
  START_DATE: '2024-01-01',
});

const DEFAULT_VALUE = { start: new Date(SERVICE_CONST.START_DATE), end: new Date(DATE_NOW) };

const RangeCalendar = ({
  name,
  required,
  disabled,
  hasDropdown = true,
  classes,
  dateFormat = 'yyyy.MM.dd',
}: RangeCalendarProps) => {
  const calendarRef = useRef<DatePicker | null>(null);
  const { setQueryParam, getQueryParam } = useQueryParams<RequiredDateParams>();
  const searchStartDate = getQueryParam('searchStartDate');
  const searchEndDate = getQueryParam('searchEndDate');

  const defaultValue =
    searchStartDate && searchEndDate
      ? { start: new Date(formatDate(searchStartDate)), end: new Date(formatDate(searchEndDate)) }
      : DEFAULT_VALUE;

  const { control } = useFormContext();
  const { field } = useController({
    name,
    defaultValue,
    control,
    disabled,
    rules: {
      required,
    },
  });

  const handleDropDownDateRangeParams = useCallback<RangeCalendarDropdownProps['handleDateRangeParams']>(
    (item) => {
      setQueryParam('searchStartDate', convertDateToString(item.startDate));
      setQueryParam('searchEndDate', convertDateToString(item.endDate));
    },
    [setQueryParam]
  );

  const handleDateRangeChange = useCallback(
    (dates?: [Date | null, Date | null]) => {
      if (Array.isArray(dates)) {
        const [start, end] = dates;

        field.onChange({ start, end });
        start && setQueryParam('searchStartDate', convertDateToString(start));
        end && setQueryParam('searchEndDate', convertDateToString(end));
      }
    },
    [field, setQueryParam]
  );

  const handleCancelClick = useCallback(() => {
    if (calendarRef.current && calendarRef.current.setOpen) {
      calendarRef.current.setOpen(false);
    }
  }, []);

  return (
    <CalendarWrapper>
      {hasDropdown && <RangeCalendarDropdown field={field} handleDateRangeParams={handleDropDownDateRangeParams} />}
      <CalendarBox>
        <StyledDatePicker
          ref={calendarRef}
          renderCustomHeader={(props) => CalendarHeader({ ...props, setOpen: calendarRef.current?.setOpen })}
          formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
          selected={field.value.start}
          startDate={field.value.start}
          endDate={field.value.end}
          onChange={handleDateRangeChange}
          dateFormat={dateFormat}
          selectsRange
          $classes={classes}
        >
          <CalendarButton onClick={handleCancelClick}>취소</CalendarButton>
        </StyledDatePicker>
      </CalendarBox>
    </CalendarWrapper>
  );
};

export default RangeCalendar;
