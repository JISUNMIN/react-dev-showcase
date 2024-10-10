import styled from 'styled-components';

import { Div } from '@src/components';
import Cell from '@src/layout/grid/Cell';
import Grid from '@src/layout/grid/Grid';

const Container = styled(Div)``;

const StyledGrid = styled(Grid)`
  margin-bottom: 20px;
`;

const Service = () => {
  {
    /* FIXME: 기획 Title Fix되면 title 변경해야됨 */
  }
  return (
    <Container>
      <StyledGrid title='생체정보' column={5}>
        <Cell title='심박 측정 이용자 수' value='1250' />
        <Cell title='체지방 측정 이용자 수 ' value='3800' />
        <Cell title='통증정도 정보 기입자수' value='34:33' />

        <Cell title='목표 설정 화면 진입자 수' value='1250' />
        <Cell title='운동 브리핑 화면 진입자 수 ' value='3800' />
        <Cell title='통증이력 화면 진입자 수 ' value='12000' />
        <Cell title='정기리포트 화면 진입자 수 ' value='3433' />
      </StyledGrid>

      <StyledGrid title='리포트' column={5}>
        <Cell title='리포트 공유하기 실행자 수' value='980' />
        <Cell title='최근 측정보기 실행자 수' value='3150' />
      </StyledGrid>

      <StyledGrid title='기타' column={5}>
        <Cell title='계정 당 평균 운동시간(운동컨텐츠 운동 시간)' value='12333' />
        <Cell title='신규 지급 포인트' value='1150' />
        <Cell title='디지털헬스케어 포탈 진입자 수' value='980' />
      </StyledGrid>
    </Container>
  );
};

export default Service;
