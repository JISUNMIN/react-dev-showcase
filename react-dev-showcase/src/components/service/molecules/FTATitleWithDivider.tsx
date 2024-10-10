import styled from 'styled-components';

import { Div, Text } from '@components/index';
import { flex, font, size } from '@styles/variables';

export interface TitleWithDividerProps {
  title?: string;
}

const Container = styled(Div)`
  ${flex({ direction: 'column', align: 'flex-start', gap: '0px' })};
  width: 100%;
  position: relative;
  margin-bottom: 40px;
`;

const Title = styled(Text)`
  ${font({ size: '22px', weight: '700' })};
  color: ${({ theme }) => theme.colors.gray10};
  padding: 20px 0;
`;

const Divider = styled(Div)`
  ${size({ w: '100%', h: '2px' })}
  background-color: ${({ theme }) => theme.colors.gray07};
`;

const FTATitleWithDivider = ({ title, ...rest }: TitleWithDividerProps) => {
  return (
    <Container {...rest}>
      <Title>{title}</Title>
      <Divider />
    </Container>
  );
};

export default FTATitleWithDivider;
