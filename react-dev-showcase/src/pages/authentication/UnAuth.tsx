import styled from 'styled-components';

import { Div, Img, Text } from '@src/components';

import Gaurd from '../../assets/i15659495402.gif';

const Container = styled(Div)``;

const UnAuth = () => {
  return (
    <Container>
      <Text>넌 못지나 간다</Text>
      <Img src={Gaurd} />
    </Container>
  );
};

export default UnAuth;
