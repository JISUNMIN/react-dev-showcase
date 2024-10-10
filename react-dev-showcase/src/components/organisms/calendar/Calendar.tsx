import { useCallback, useRef } from 'react';

import DatePicker, { DatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useController, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Button, Div } from '@components/index';
import renderCustomHeader from '@components/organisms/calendar/CalendarHeader';
import { CalendarButtonStyle, CalendarDefaultStyles } from '@styles/organisms/Calendar';

export type CalendarProps = DatePickerProps & {
  name: string;
  defaultValue?: Date;
};

const CalendarWrapper = styled(Div)`
  ${CalendarDefaultStyles}
`;

const CalendarButton = styled(Button)`
  ${CalendarButtonStyle}
`;

const DATE_NOW = Date.now();

const Calendar = ({
  name,
  required,
  disabled,
  defaultValue = new Date(DATE_NOW),
  dateFormat = 'yyyy.MM.dd',
}: CalendarProps) => {
  const calendarRef = useRef<DatePicker | null>(null);

  const handleCancelClick = useCallback(() => {
    if (calendarRef.current) {
      calendarRef.current.setOpen && calendarRef.current.setOpen(false);
    }
  }, []);

  const { control } = useFormContext();
  const { field } = useController({
    name,
    defaultValue,
    control,
    rules: {
      required,
    },
  });

  const handleDateRangeChange = useCallback(
    (date: Date | null) => {
      if (date !== null) {
        field.onChange(date);
      }
    },
    [field]
  );

  return (
    <CalendarWrapper>
      <DatePicker
        ref={calendarRef}
        renderCustomHeader={(props) =>
          renderCustomHeader({
            ...props,
            setOpen: (open: boolean) => {
              calendarRef.current && calendarRef.current.setOpen(open);
            },
          })
        }
        formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
        selected={field.value}
        disabled={disabled}
        onChange={handleDateRangeChange}
        dateFormat={dateFormat}
      >
        <CalendarButton onClick={handleCancelClick}>취소</CalendarButton>
      </DatePicker>
    </CalendarWrapper>
  );
};

Calendar.dislayName = 'Calendar';

export default Calendar;
