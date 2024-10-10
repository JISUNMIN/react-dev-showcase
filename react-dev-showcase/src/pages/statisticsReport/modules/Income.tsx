import styled from 'styled-components';

import { Div } from '@src/components';
import Cell from '@src/layout/grid/Cell';
import Grid from '@src/layout/grid/Grid';

const Container = styled(Div)``;

const StyledGrid = styled(Grid)`
  margin-bottom: 20px;
`;

const Income = () => {
  {
    /* FIXME: 기획 Title Fix되면 title 변경해야됨 */
  }
  return (
    <Container>
      <StyledGrid title='Subscription(Revenue,억원)' column={5}>
        <Cell title='프리미엄 요금제 수익' value='1250' />
        <Cell title='스탠다드 요금제 수익 ' value='3800' />
        <Cell title='라이트 요금제 수익' value='34:33' />
      </StyledGrid>

      <StyledGrid title='광고수익' column={5}>
        <Cell title='비디오 광고 수익' value='1250' />
        <Cell title='배너 광고 수익 ' value='3800' />
      </StyledGrid>

      <StyledGrid title='연결수수료' column={5}>
        <Cell title='홈케어 프로그램' value='12333' />
        <Cell title='아웃도어 액티비티' value='1150' />
      </StyledGrid>
    </Container>
  );
};

export default Income;
