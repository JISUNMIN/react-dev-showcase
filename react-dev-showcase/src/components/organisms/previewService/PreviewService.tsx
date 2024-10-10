import styled from 'styled-components';

import { Div } from '@src/components/atoms';

const Container = styled(Div)`
  width: 80vw;
  height: 80vh;
  position: relative;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const PreviewService = () => {
  return (
    <Container>
      <StyledIframe src={`/iframe/index.html`} />
    </Container>
  );
};

export default PreviewService;
