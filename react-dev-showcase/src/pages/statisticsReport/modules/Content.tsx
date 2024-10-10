import styled from 'styled-components';

import { Div } from '@src/components';
import Cell from '@src/layout/grid/Cell';
import Grid from '@src/layout/grid/Grid';

const Container = styled(Div)``;

const StyledGrid = styled(Grid)`
  margin-bottom: 20px;
`;

const Content = () => {
  {
    /* FIXME: 기획 Title Fix되면 title 변경해야됨 */
  }
  return (
    <Container>
      <StyledGrid title='바디 체크 업' column={5}>
        <Cell title='Body Alignment 측정자 수' value='1250' />
        <Cell title='Body Alignment 측정 횟수' value='3800' />
        <Cell title='Body Alignment Workout 실행자수' value='350' />
        <Cell title='Body Alignment Workout 실행 시간' value='34:33' />
        <Cell title='ROM 측정자 수' value='120' />
        <Cell title='ROM 측정횟수' value='300' />
        <Cell title='ROM Workout 실행자 수' value='80' />
        <Cell title='ROM Workout 실행 시간' value='12:45' />
        <Cell title='Body Balance 측정자 수' value='500' />
        <Cell title='Body Balance 측정 횟수' value='1000' />
        <Cell title='Body Balance Workout 실행자 수' value='200' />
        <Cell title='Body Balance Workout 실행 시간' value='22:30' />
        <Cell title='Physical Test 측정자 수' value='800' />
        <Cell title='Physical Test 측정 횟수' value='1500' />
        <Cell title='PhysicalTest Workout 실행자 수' value='400' />
        <Cell title='PhysicalTest Workout 실행 시간' value='18:20' />
      </StyledGrid>

      <StyledGrid title='홈케어 프로그램' column={5}>
        <Cell title='LG 시그니처 프로그램 이용자 수' value='980' />
        <Cell title='외부 센터 프로그램 무료 프로그램 사용시간(hr)' value='3150' />
        <Cell title='전문가 센터 프로그램 이용자 수' value='750' />
        <Cell title='외부 센터 프로그램 유료 프로그램 사용시간(hr)' value='750' />
        <Cell title='AI 추천 프로그램 이용자 수' value='3150' />
        <Cell title='동작별 영상 (AI 추천 컨텐츠) 유료 프로그램 (큐레이션) 사용시간(hr)' value='750' />
        <Cell title='AI 추천 프로그램 생성하기 실행자 수' value='750' />
      </StyledGrid>

      <StyledGrid title='유료회원 수' column={5}>
        <Cell title='프리미엄 요금제 가입자 수' value='620' />
        <Cell title='스탠다드 요금제 가입자 수' value='1150' />
        <Cell title='라이트 요금제 가입자 수' value='980' />
        <Cell title='유료가입 이탈자 수' value='150' />
        <Cell title='유료가입 이탈율' value='12%' />
      </StyledGrid>

      <StyledGrid title='아웃도어 액티비티' column={5}>
        <Cell title='산책/조깅서비스 무료 이용자 수' value='550' />
        <Cell title='산책/조깅서비스무료 프로그램 사용시간(hr)' value='780' />
        <Cell title='산책/조깅서비스 유료 이용자 수' value='420' />
        <Cell title='산책/조깅서비스 유료 프로그램 사용시간(hr)' value='310' />

        <Cell title='하이킹 서비스 무료 이용자 수' value='350' />
        <Cell title='하이킹 서비스 무료 프로그램 사용시간(hr)' value='480' />
        <Cell title='하이킹 서비스 유료 이용자 수' value='210' />
        <Cell title='하이킹 서비스 유료 프로그램 사용시간(hr)' value='360' />

        <Cell title='대회 참가 서비스 무료 이용자 수' value='250' />
        <Cell title='대회 참가 서비스 무료 프로그램 사용시간(hr)' value='380' />
        <Cell title='대회 참가 서비스 유료 이용자 수' value='180' />
        <Cell title='대회 참가 서비스 유료 프로그램 사용시간(hr)' value='270' />

        <Cell title='골프코칭 서비스 무료 이용자 수' value='180' />
        <Cell title='골프코칭 서비스 무료 프로그램 사용시간(hr)' value='300' />
        <Cell title='골프코칭 서비스 유료 이용자 수' value='120' />
        <Cell title='골프코칭 서비스 유료 프로그램 사용시간(hr)' value='180' />
      </StyledGrid>
    </Container>
  );
};

export default Content;
