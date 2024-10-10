import styled from 'styled-components';

import { Div } from '@src/components';
import Cell from '@src/layout/grid/Cell';
import Grid from '@src/layout/grid/Grid';

const Container = styled(Div)``;

const StyledGrid = styled(Grid)`
  margin-bottom: 20px;
`;

const Commerce = () => {
  {
    /* FIXME: 기획 Title Fix되면 title 변경해야됨 */
  }
  return (
    <Container>
      <StyledGrid title='상품 구매 동향' column={5}>
        <Cell title='신상품 노출 수' value='1250' />
        <Cell title='구매사이트 이동 수 ' value='3800' />
        <Cell title='구매 수' value='34:33' />
      </StyledGrid>

      <StyledGrid title='결제' column={5}>
        <Cell title='결제 수 (카드)' value='1250' />
        <Cell title='결제 수 (계좌이체) ' value='3800' />
        <Cell title='TV앱 결제 수 ' value='3800' />
        <Cell title='모바일 결제수 ' value='3800' />
        <Cell title='Q카드 결제 수 ' value='3800' />
      </StyledGrid>
    </Container>
  );
};

export default Commerce;
