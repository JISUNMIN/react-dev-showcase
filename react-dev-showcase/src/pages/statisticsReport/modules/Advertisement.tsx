import styled from 'styled-components';

import { Div } from '@src/components';
import Cell from '@src/layout/grid/Cell';
import Grid from '@src/layout/grid/Grid';

const Container = styled(Div)``;

const StyledGrid = styled(Grid)`
  margin-bottom: 20px;
`;

const Advertisement = () => {
  {
    /* FIXME: 기획 Title Fix되면 title 변경해야됨 */
  }
  return (
    <Container>
      <StyledGrid title='비디오광고' column={5}>
        <Cell title='비디오 광고 노출수' value='19900' />
        <Cell title='비디오광고 노출시간(sec) ' value='24' />
      </StyledGrid>

      <StyledGrid title='배너광고' column={5}>
        <Cell title='배너 광고 클릭수' value='17400' />
        <Cell title='배너 광고 클릭:제휴 사이트 노출시간(sec)' value='21' />
      </StyledGrid>

      <StyledGrid title='아웃도어 액티비티' column={5}>
        <Cell title='산책 TV 광고표지판 클릭 수' value='12333' />
        <Cell title='산책 TV 광고표지판클릭 : 제휴사이트 노출시간(sec)' value='1150' />
      </StyledGrid>
    </Container>
  );
};

export default Advertisement;
