import { ReactNode } from 'react';

import styled from 'styled-components';

import { Div, Span } from '@src/components/atoms';
import { font, grid } from '@src/styles/variables';

interface GridFieldProps {
  /** 좌측 라벨 */
  label?: string;
  /** (*) 표시 여부  */
  isRequired?: boolean;
  /**  우측 내용 */
  children?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
  alignStart?: boolean;
}

const GridFieldWrapper = styled(Div)<{ $alignStart: boolean }>`
  ${({ $alignStart }) =>
    $alignStart
      ? `${grid({ columns: 'minmax(140px, 1fr) 15fr', gap: '20px', align: 'start' })}`
      : `${grid({ columns: 'minmax(140px, 1fr) 15fr', gap: '20px', align: 'center' })}`}
  padding: 24px 0;
`;

const GridFieldLabel = styled(Span)<{ $isRequired: boolean; $colSpan?: number; $rowSpan?: number }>`
  ${font({ weight: '700' })};
  word-wrap: break-word;
  ${({ $colSpan }) => {
    if ($colSpan && $colSpan > 0) {
      return `grid-column: 1 / span ${$colSpan};`;
    }
    $colSpan;
  }}
  ${({ $rowSpan }) => {
    if ($rowSpan && $rowSpan > 0) {
      return `grid-row: 1 / span ${$rowSpan};`;
    }
    $rowSpan;
  }}
  ${({ $isRequired, theme }) =>
    $isRequired &&
    `
      &:after {
        content: '*';
        color: ${theme.colors.red};
        ${font({ size: '13px' })};
      }
    `}
`;

const GridField = ({
  label,
  isRequired = false,
  colSpan = 1,
  rowSpan = 1,
  children,
  alignStart = false,
}: GridFieldProps) => {
  return (
    <GridFieldWrapper $alignStart={alignStart}>
      <GridFieldLabel $isRequired={isRequired} $colSpan={colSpan} $rowSpan={rowSpan}>
        {label}
      </GridFieldLabel>
      {children}
    </GridFieldWrapper>
  );
};

export default GridField;
