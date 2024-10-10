import styled, { CSSObject } from 'styled-components';

import { Div, Text } from '@components/index';
import { absolute, font, grid, size } from '@src/styles/variables';

interface CellProps {
  title: string;
  value: string | number;
  classes?: CSSObject;
}

const CellContainer = styled(Div)`
  ${grid({ align: 'flex-start' })}
  box-sizing: border-box;
  position: relative;
  padding: 20px;
  height: 150px;
  border-radius: 12px;
  line-height: 1.17;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.gray04};
  background: ${({ theme }) => theme.colors.brown01};

  ::after {
    ${absolute({ top: '50%', left: '50%' })}
    ${size({ w: '90%', h: '0.2px' })}
    transform: translate(-50%, -50%);
    content: '';
    background-color: ${({ theme }) => theme.colors.gray05};
  }
`;

const Title = styled(Text)`
  ${font({ size: '16px', weight: '400' })}
  color: ${({ theme }) => theme.colors.gray08};
`;

const Value = styled(Div)`
  ${font({ size: '26px', weight: '700' })}
  align-self: flex-end;
  color: ${({ theme }) => theme.colors.gray10};
`;

const Cell = ({ title, value, ...rest }: CellProps) => {
  return (
    <CellContainer {...rest}>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </CellContainer>
  );
};

export default Cell;
