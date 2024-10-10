import styled from 'styled-components';

import { Accordion, Div } from '@src/components';
import Cell from '@src/layout/grid/Cell';
import Grid from '@src/layout/grid/Grid';

const Container = styled(Div)``;

const StyledGrid = styled(Grid)`
  margin-bottom: 20px;
`;
const CPManagement = () => {
  {
    /* FIXME: 기획 Title Fix되면 title 변경해야됨 */
  }
  return (
    <Container>
      <StyledGrid title='접속자 수/사용량' column={5}>
        <Cell title='DAU' value='1250' />
        <Cell title='MAU' value='3800' />
        <Cell title='하루 평균 사용시간' value='34:33' />
        <Cell title='하루 평균 사용 페이지 수' value='12' />
      </StyledGrid>

      <StyledGrid title='사용자 필수실행 조건' column={5}>
        <Cell title='앱 Lock 실행자 수' value='980' />
        <Cell title='약관에 동의한 사람수' value='3150' />
        <Cell title='설문조사 완료자 수' value='750' />
      </StyledGrid>

      <StyledGrid title='유료회원 수' column={5}>
        <Cell title='프리미엄 요금제 가입자 수' value='620' />
        <Cell title='스탠다드 요금제 가입자 수' value='1150' />
        <Cell title='라이트 요금제 가입자 수' value='980' />
        <Cell title='유료가입 이탈자 수' value='150' />
        <Cell title='유료가입 이탈율' value='12%' />
      </StyledGrid>

      <StyledGrid title='TV 스펙' column={5}>
        <Cell title='O24 Chip(SoC 칩) 사양 TV 구매자 수' value='550' />
        <Cell title='O22 Chip(SoC 칩) 사양 TV 구매자 수' value='780' />
        <Cell title='K24 Chip(SoC 칩) 사양 TV 구매자 수' value='420' />
        <Cell title='외산 Chip(SoC 칩) 사양 TV 구매자 수' value='310' />
      </StyledGrid>

      <StyledGrid title='Connectivity' column={5}>
        <Cell title='USB 카메라 연결자 수' value='280' />
        <Cell title='DHD(Digital Healthcare Device) 연결자 수' value='150' />
      </StyledGrid>

      <Accordion title='접속자수 그래프'>
        <p>접속자수 그래프</p>
      </Accordion>
      <Accordion title='사용자 필수실행 조건 그래프'>
        <p>사용자 필수실행 조건 그래프</p>
      </Accordion>
      <Accordion title='유료회원 수 그래프'>
        <p>유료회원 수 그래프</p>
      </Accordion>
      <Accordion title='TV 스펙그래프'>
        <p>TV 스펙그래프</p>
      </Accordion>
      <Accordion title='Connectivity 그래프'>
        <p>Connectivity 그래프</p>
      </Accordion>
    </Container>
  );
};

export default CPManagement;
