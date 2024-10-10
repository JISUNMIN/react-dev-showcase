import { ReactNode } from 'react';

import styled, { CSSObject } from 'styled-components';

import { Div, Text } from '@src/components';
import { flex } from '@src/styles/variables';

import Cell from './Cell';

interface GridBoxProps {
  /** 행(row) */
  row?: number;
  /** 열(column) */
  column?: number;
  /** 타이틀 */
  title?: string;
  /** 서브 타이틀(GridBox 내부 타이틀) */
  subtitle?: string;
  /** 서브 타이틀의 총합 */
  totalCount?: string;
  /** 배경색 값(background) */
  background?: string;
  children?: ReactNode;
  classes?: CSSObject;
}

const GridContainer = styled(Div)`
  ${flex({ direction: 'column', align: 'flex-start', justify: 'flex-start', gap: '16px' })}
  width: 100%;
`;

const GridStyled = styled(Div)<{ column: number; row: number; background?: string }>`
  display: grid;
  position: relative;
  width: 100%;
  grid-template-columns: repeat(${({ column }) => column}, 1fr);
  grid-template-rows: repeat(${({ row }) => row}, 1fr);
  gap: 20px;
  background: ${({ background }) => background};
  ${({ classes }) => classes && classes.Grid}
`;

const GridLayout = styled(Div)`
  display: inline-flex;
  width: 100%;
  padding: 10px;
  margin-bottom: 40px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.brown01};
`;

const StyledCell = styled(Cell)`
  background: none;
  border: none;
`;

const StyledText = styled(Text)`
  font-weight: 700;
`;

const GridBox = ({
  column = 1,
  row = 1,
  title,
  subtitle = '',
  totalCount = '',
  background,
  children,
  classes,
}: GridBoxProps) => (
  <GridContainer>
    {title ? <StyledText>{title}</StyledText> : null}
    <GridLayout>
      <StyledCell title={subtitle} value={totalCount} />
      <GridStyled classes={classes} background={background} column={column} row={row}>
        {children}
      </GridStyled>
    </GridLayout>
  </GridContainer>
);

GridBox.propTypes = {};

export default GridBox;
