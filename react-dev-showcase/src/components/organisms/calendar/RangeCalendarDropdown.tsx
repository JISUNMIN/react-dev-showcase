import { useCallback, useState } from 'react';

import { BottomSheetIcon } from '@images';
import { UseControllerReturn } from 'react-hook-form';
import styled, { css } from 'styled-components';

import { Div, Icon, Text } from '@src/components/atoms';
import { flex, font, size } from '@src/styles/variables';
import { dateCalculator } from '@utils/helpers';

export interface RangeCalendarDropdownProps {
  field: UseControllerReturn['field'];
  width?: number;
  height?: number;
  handleDateRangeParams: (item: { startDate: Date; endDate: Date; name: string }) => void;
}

const StyledContainer = styled(Div)<{ width: number; height: number }>`
  --option-width: ${({ width }) => `${width}px`};
  --option-height: ${({ height }) => `${height}px`};
  --option-font-size: 14px;
  --option-padding: 12px;

  position: relative;
  height: var(--option-height);
`;

const LabelContainer = styled(Div)`
  ${flex({ justify: 'space-between' })}
  width: var(--option-width);
  padding: var(--option-padding);
  cursor: pointer;
  border-radius: 8px;
`;

const InitialLabel = styled(Text)`
  ${font({ size: 'var(--option-font-size)' })}
`;

const DropDownIcon = styled(Icon)<{ $isShow: boolean }>`
  ${size({ w: '14px', h: '14px' })}
  transform: ${({ $isShow }) => ($isShow ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const OptionList = styled.ul<{ $isShow: boolean }>`
  position: absolute;
  top: calc(var(--option-height) + 8px);
  width: var(--option-width);
  display: ${({ $isShow }) => ($isShow ? 'block' : 'none')};
  border: 1px solid ${({ theme }) => theme.colors.gray03};
  border-radius: 8px;
  text-align: center;
  font-size: var(--option-font-size);
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.gray01};
  z-index: 2;
`;

const OptionItem = styled.li<{ $isSelected: boolean }>`
  padding: var(--option-padding);
  cursor: pointer;
  font-weight: 600;

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: ${({ theme }) => theme.colors.brown01};
      border-radius: 4px;
      color: ${({ theme }) => theme.colors.brown04};
    `}

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover01};
    border-radius: 4px;
  }
`;

const DATE_NOW = Date.now();
const { conditions, method } = dateCalculator;

const OPTIONS = [
  { name: '오늘', ...method(new Date(DATE_NOW), conditions.TODAY) },
  { name: '어제', ...method(new Date(DATE_NOW), conditions.YESTERDAY) },
  { name: '이번 주', ...method(new Date(DATE_NOW), conditions.THIS_WEEK) },
  { name: '지난주', ...method(new Date(DATE_NOW), conditions.LAST_WEEK) },
  { name: '이번 달', ...method(new Date(DATE_NOW), conditions.THIS_MONTH) },
  { name: '지난달', ...method(new Date(DATE_NOW), conditions.LAST_MONTH) },
  { name: '최근 7일', ...method(new Date(DATE_NOW), conditions.RECENT_7_DAYS) },
  { name: '최근 30일', ...method(new Date(DATE_NOW), conditions.RECENT_30_DAYS) },
];

const RangeCalendarDropdown = ({
  field,
  width = 140,
  height = 40,
  handleDateRangeParams,
  ...rest
}: RangeCalendarDropdownProps) => {
  const [isShow, setIsShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const onSelectBoxClick = useCallback(() => {
    setIsShow((prev) => !prev);
  }, []);

  const onItemClick = useCallback(
    (item: { startDate: Date; endDate: Date; name: string }, index: number) => {
      setCurrentIndex(index);
      field.onChange({ start: item.startDate, end: item.endDate });
      handleDateRangeParams(item);
    },
    [field, handleDateRangeParams]
  );

  return (
    <StyledContainer onClick={onSelectBoxClick} width={width} height={height} {...rest}>
      <LabelContainer>
        <InitialLabel>{currentIndex === -1 ? '기간 선택' : OPTIONS[currentIndex].name}</InitialLabel>
        <DropDownIcon icon={BottomSheetIcon} $isShow={isShow} />
      </LabelContainer>
      {
        <OptionList $isShow={isShow}>
          {OPTIONS.map((item, index) => (
            <OptionItem
              key={`${item?.name}-${index}`}
              $isSelected={currentIndex === index}
              onClick={() => onItemClick(item, index)}
            >
              {item.name}
            </OptionItem>
          ))}
        </OptionList>
      }
    </StyledContainer>
  );
};

export default RangeCalendarDropdown;
