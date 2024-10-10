import { ReactNode } from 'react';

import styled, { CSSObject, RuleSet } from 'styled-components';

import { Div, Text } from '@components/atoms';
import { flex, font } from '@src/styles/variables';

interface GridProps {
  /** 부모 컴포넌트가 전달한 style */
  classes?: {
    Grid?: RuleSet<object>;
  };
  /** Grid Item components */
  children: ReactNode;
  /** 열(column) */
  column?: number;
  /** 행(row) */
  row?: number;
  /** 배경색 값(background) */
  background?: string;
  /** 타이틀 */
  title?: string;
  className?: string;
}

const GridContainer = styled(Div)`
  ${flex({ direction: 'column', align: 'flex-start', justify: 'center', gap: '16px' })}
`;

const StyledText = styled(Text)`
  ${font({ weight: 'bold' })}
`;

const GridBox = styled(Div)<{ classes?: CSSObject; background?: string; column?: number; row?: number }>`
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${({ column }) => column}, 1fr);
  grid-template-rows: repeat(${({ row }) => row}, 1fr);
  gap: 20px;
  background: ${({ background }) => background || 'transparent'};
  ${({ classes }) => classes && classes}
`;

const Grid = ({ classes, children, column = 1, row = 1, background, title, className }: GridProps) => (
  <GridContainer>
    {title ? <StyledText>{title}</StyledText> : null}
    <GridBox classes={classes} background={background} column={column} row={row} className={className}>
      {children}
    </GridBox>
  </GridContainer>
);

export default Grid;
