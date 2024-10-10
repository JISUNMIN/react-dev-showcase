import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import styled, { css, useTheme } from 'styled-components';

import { Button, Div, FTADropdown, FTADropdownMult, RangeCalendar, Text } from '@components/index';
import { BarChart, DonutChart, LineChart, MapChart, Swiper } from '@components/index';
import FilterChip from '@src/components/molecules/chip/FilterChip';
import { useQueryParams } from '@src/hooks';
import Cell from '@src/layout/grid/Cell';
import Grid from '@src/layout/grid/Grid';
import GridBox from '@src/layout/grid/GridBox';
import { TIME_OPTIONS } from '@src/libs/utils/dataProcessing';
import { flex, font, grid, size } from '@src/styles/variables';
import { userInfoStore } from '@src/zustand';
import { CodeValue } from '@src/zustand/enumStore';

export interface RequiredQueryParams {
  REGION_OPTIONS: CodeValue[];
  PLATFORM_OPTIONS: CodeValue[];
  AGE_GROUP_OPTIONS: CodeValue[];
  PRIMARY_MENU_OPTIONS: CodeValue[];
  secondaryMenuOptions: CodeValue[];
  DAY_OPTIONS: CodeValue[];
  TIME_OPTIONS: CodeValue[];
}

interface RHFArgs {
  PLATFORM_OPTIONS: CodeValue[];
  AGE_GROUP_OPTIONS: CodeValue[];
  PRIMARY_MENU_OPTIONS: CodeValue[];
  secondaryMenuOptions: CodeValue[];
  DAY_OPTIONS: CodeValue[];
  TIME_OPTIONS: CodeValue[];
}

const Container = styled(Div)`
  --height: 400px;
  --padding: 10px;
  --border-radius: 16px;
  --border: 1px solid ${({ theme }) => theme.colors.gray04};
  --line-padding: 0px 0px 0px 32px;
`;

const chartCss = css`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.gray04};
  border-radius: 16px;
  height: 400px;
`;

const Welcome = styled(Div)`
  ${flex({ justify: '', gap: '10px' })}
  margin-bottom: 36px;
`;

const StyledText = styled(Text)<{ $color?: string }>`
  ${font({ size: '32px', weight: '700' })}
  color:${({ $color }) => $color};
`;

const LineChartContainer = styled(Div)`
  border: var(--border);
  border-radius: var(--border-radius);
  height: var(--height);
`;

const BarChartContainer = styled(Div)`
  ${chartCss}
  padding: var(--line-padding);
`;

const MapChartContainer = styled(Div)`
  ${chartCss}
`;

const DonutChartContainer = styled(Div)`
  ${chartCss}
  padding: var(--padding);
`;

const ButtonContainer = styled(Div)`
  ${flex({ justify: 'end', gap: '10px' })}
  margin-top: 12px;
  margin-right: 32px;
`;

const unselectedButtonCss = css`
  background: ${({ theme }) => theme.colors.gray02};
  color: ${({ theme }) => theme.colors.gray07};
`;

const GridContainer = styled(Div)`
  width: 100%;
  margin-top: 50px;
`;

const StyledGrid = styled(Grid)`
  margin-bottom: 20px;
`;

const StyledCell = styled(Cell)<{ $bigSize?: boolean; $grayColor?: boolean }>`
  background: ${({ $grayColor, theme }) => $grayColor && theme.colors.gray02};
  height: ${({ $bigSize }) => $bigSize && '170px'};
`;

const GridBoxContainer = styled(Div)`
  ${grid({ align: 'center', columns: '5fr 1fr', gap: '20px' })}
  -webkit-box-align: center;
  width: 100%;
`;

const GridArea = styled(Div)``;

const SelectBoxContainer = styled(Div)`
  ${flex({ justify: '', align: '', gap: '10px' })}
  margin-bottom: 40px;
`;

const ChipDateContainer = styled(Div)`
  ${flex({ justify: 'space-between', gap: '10px' })}
  margin-bottom: 15px;
`;

const StyledButton = styled(Button)<{ isSwichPeriod: boolean }>`
  ${font({ size: '14px', weight: '700' })}
  ${size({ w: '57px', h: '30px' })}
  margin: 0px 2px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.brown01};
  color: ${({ theme }) => theme.colors.brown03};
  ${({ isSwichPeriod }) => !isSwichPeriod && unselectedButtonCss}
`;

const StyledRHFDropDownMult = styled(FTADropdownMult)``;

const StyledRHFDropDown = styled(FTADropdown)``;

const CP_OPTIONS = [
  { code: '서초 지점', value: '서초 지점' },
  { code: '학동 지점', value: '학동 지점' },
  { code: '교대 지점', value: '교대 지점' },
];

const REGION_OPTIONS = [
  { code: '대한민국', value: '대한민국' },
  { code: '무언가', value: '무언가' },
];

const PLATFORM_OPTIONS = [
  { code: 'WebOS 4.0', value: 'WebOS 4.0' },
  { code: 'WebOS 4.5', value: 'WebOS 4.5' },
  { code: 'WebOS 5.0', value: 'WebOS 5.0' },
  { code: 'WebOS 6.0', value: 'WebOS 6.0' },
  { code: 'WebOS 22', value: 'WebOS 22' },
  { code: 'WebOS 23', value: 'WebOS 23' },
];
const AGE_GROUP_OPTIONS = [
  { code: '20대 미만', value: '20대 미만' },
  { code: '20대', value: '20대' },
  { code: '30대', value: '30대' },
  { code: '40대', value: '40대' },
  { code: '50대', value: '50대' },
  { code: '60대', value: '60대' },
  { code: '70대', value: '70대' },
  { code: '80대 이상', value: '80대 이상' },
];

const PRIMARY_MENU_OPTIONS = [
  { code: '바디 체크업', value: '바디 체크업' },
  { code: '홈케어 프로그램', value: '홈케어 프로그램' },
  { code: '아웃도어 액티비티', value: '아웃도어 액티비티' },
];

const DAY_OPTIONS = [
  { code: '일', value: '일' },
  { code: '월', value: '월' },
  { code: '화', value: '화' },
  { code: '수', value: '수' },
  { code: '목', value: '목' },
  { code: '금', value: '금' },
  { code: '토', value: '토' },
];

const SECONDARY_MENU_OPTIONS = [
  [
    { code: '체형분석', value: '체형분석' },
    { code: '관절가동범위', value: '관절가동범위' },
    { code: '신체 균형', value: '신체 균형' },
    { code: '신체능력', value: '신체능력' },
  ],
  [
    { code: '프로그램', value: '프로그램' },
    { code: 'AI 추천 프로그램', value: 'AI 추천 프로그램' },
  ],
  [
    { code: '산책/조깅', value: '산책/조깅' },
    { code: '하이킹', value: '하이킹' },
    { code: '골프 코칭', value: '골프 코칭' },
    { code: '트레이닝', value: '트레이닝' },
  ],
];

const Home = () => {
  const lineChartRef = useRef<HTMLDivElement | null>(null);
  const { userInfo } = userInfoStore((state) => state);
  const adminNickname = userInfo?.adminNickname ?? '';
  const hookformInstance = useForm<RHFArgs>();

  const theme = useTheme();
  const [swichPeriod, setSwichPeriod] = useState(0);
  const [swiperWidth, setSwiperWidth] = useState<number | null>(null);
  const [primaryMenuSelectedIndex, setPrimaryMenuSelectedIndex] = useState<number | null>(null);
  const [secondaryMenuOptions, setSecondaryMenuOptions] = useState<CodeValue[]>([]);
  const { setQueryParam } = useQueryParams<{ [key: string]: string }>();
  const preSecondaryMenuOptions = useRef(null);
  const timeOption = useMemo(() => TIME_OPTIONS(), []);

  const chartData = useMemo(() => {
    const chartSeries = [
      [
        {
          name: '요일',
          data: [10, 241, 135, 51, 20, 162, 69],
        },
      ],
      [{ name: '분기', data: [10, 241, 135, 51] }],
    ];
    const categories = [
      ['일', '월', '화', '수', '목', '금', '토'],
      ['1분기', '2분기', '3분기', '4분기'],
    ];
    return {
      series: chartSeries[swichPeriod],
      categories: categories[swichPeriod],
    };
  }, [swichPeriod]);

  const handleResizeBarChart = useCallback(() => {
    if (lineChartRef.current) {
      setSwiperWidth(lineChartRef.current.clientWidth - 50);
    }
  }, []);

  useEffect(() => {
    handleResizeBarChart();
    window.addEventListener('resize', handleResizeBarChart);

    return () => window.removeEventListener('resize', handleResizeBarChart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (primaryMenuSelectedIndex !== null) {
      setSecondaryMenuOptions(SECONDARY_MENU_OPTIONS[primaryMenuSelectedIndex]);
      if (
        preSecondaryMenuOptions.current !== null &&
        preSecondaryMenuOptions.current !== SECONDARY_MENU_OPTIONS[primaryMenuSelectedIndex]
      ) {
        setQueryParam('secondaryMenuOptions', '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryMenuSelectedIndex]);

  return (
    <Container>
      <FormProvider {...hookformInstance}>
        <Welcome>
          <StyledText>Welcome</StyledText>
          <StyledText $color={theme.colors.gray06}> {`${adminNickname ?? ''}님`} </StyledText>
        </Welcome>
        <ChipDateContainer>
          <FilterChip
            name='CP_OPTIONS'
            fieldArrayName='CP_OPTIONS_FIELD_ARRAY'
            placeholder={'CP선택'}
            content={CP_OPTIONS}
          />
          <RangeCalendar name='calendar' />
        </ChipDateContainer>
        <SelectBoxContainer>
          <StyledRHFDropDownMult name='REGION_OPTIONS' content={REGION_OPTIONS} placeholder='권역 선택' />
          <StyledRHFDropDownMult name='PLATFORM_OPTIONS' content={PLATFORM_OPTIONS} placeholder='플랫폼 선택' />
          <StyledRHFDropDownMult name='AGE_GROUP_OPTIONS' content={AGE_GROUP_OPTIONS} placeholder='연령대 선택' />
          <StyledRHFDropDown
            name='PRIMARY_MENU_OPTIONS'
            content={PRIMARY_MENU_OPTIONS}
            placeholder='1차 메뉴 선택'
            setCheckedIndex={setPrimaryMenuSelectedIndex}
          />
          <StyledRHFDropDownMult
            name='secondaryMenuOptions'
            content={secondaryMenuOptions}
            placeholder='2차 메뉴 선택'
            disabled={primaryMenuSelectedIndex === null}
          />
          <StyledRHFDropDownMult name='DAY_OPTIONS' content={DAY_OPTIONS} placeholder='요일 선택' />
          <StyledRHFDropDownMult name='TIME_OPTIONS' content={timeOption} placeholder='시간 선택' />
        </SelectBoxContainer>
      </FormProvider>
      <Swiper>
        <LineChartContainer ref={lineChartRef}>
          <LineChart
            height='100%'
            title='산책/조깅서비스 무료'
            series={[
              { name: '이용자 수', data: [10, 241, 135, 51, 20, 162, 69, 191] },
              { name: '사용시간(hr)', data: [30, 26, 34, 10, 30, 26, 34, 10] },
            ]}
            showLegend={{ top: true, bottom: true }}
          />
        </LineChartContainer>

        <BarChartContainer>
          <ButtonContainer>
            <StyledButton onClick={() => setSwichPeriod(0)} isSwichPeriod={swichPeriod === 0}>
              요일
            </StyledButton>
            <StyledButton onClick={() => setSwichPeriod(1)} isSwichPeriod={swichPeriod === 1}>
              분기
            </StyledButton>
          </ButtonContainer>

          <BarChart
            title='요일/분기별 현황'
            series={chartData.series}
            borderRadius={9}
            categories={chartData.categories}
            showGrid={false}
            enabledDataLabels={false}
            showLabels={false}
            width={`${swiperWidth}px`}
          />
        </BarChartContainer>
        <DonutChartContainer>
          <DonutChart
            width='280px'
            height='280px'
            title='운동목적'
            series={[19, 37, 23, 31, 92]}
            labels={['목 운동', '팔 운동', '등 운동', '허리 운동', '다리 운동']}
          />
        </DonutChartContainer>

        <MapChartContainer>
          <MapChart title='권역별 현황' />
        </MapChartContainer>
      </Swiper>
      {/* FIXME: 기획 Title Fix되면 title 변경해야됨 */}
      <GridContainer>
        <StyledGrid title='사용자 필수실행 조건' column={5}>
          <StyledCell title='앱 Lock 실행자 수' value='980' />
          <StyledCell title='약관에 동의한 사람수' value='3150' />
          <StyledCell title='설문조사 완료자 수' value='750' />
          <StyledCell title='설문조사 완료자 수' value='750' />
          <StyledCell title='설문조사 완료자 수' value='750' />
        </StyledGrid>
        <GridBoxContainer>
          <GridArea>
            <GridBox title='접속자 수/사용량' subtitle='나의 몸 알아보기 측정자수' totalCount='122222' column={4}>
              <StyledCell title='DAU' value='1250' $grayColor />
              <StyledCell title='MAU' value='3800' $grayColor />
              <StyledCell title='하루 평균 사용시간' value='34:33' $grayColor />
              <StyledCell title='하루 평균 사용 페이지 수' value='12' $grayColor />
            </GridBox>
          </GridArea>
          <GridArea>
            <StyledCell title='하루 평균 사용 페이지 수' value='12' $bigSize />
          </GridArea>
        </GridBoxContainer>
        <GridBox title='접속자 수/사용량' subtitle='나의 몸 알아보기 측정자수' totalCount='122222' column={3}>
          <StyledCell title='DAU' value='1250' $grayColor />
          <StyledCell title='MAU' value='3800' $grayColor />
          <StyledCell title='하루 평균 사용시간' value='34:33' $grayColor />
        </GridBox>
        <GridBox title='접속자 수/사용량' subtitle='나의 몸 알아보기 측정자수' totalCount='122222' column={4}>
          <StyledCell title='DAU' value='1250' $grayColor />
          <StyledCell title='MAU' value='3800' $grayColor />
          <StyledCell title='하루 평균 사용시간' value='34:33' $grayColor />
          <StyledCell title='하루 평균 사용시간' value='34:33' $grayColor />
        </GridBox>
        <GridBox title='접속자 수/사용량' subtitle='나의 몸 알아보기 측정자수' totalCount='122222' column={5}>
          <StyledCell title='DAU' value='1250' $grayColor />
          <StyledCell title='MAU' value='3800' $grayColor />
          <StyledCell title='하루 평균 사용시간' value='34:33' $grayColor />
          <StyledCell title='하루 평균 사용시간' value='34:33' $grayColor />
          <StyledCell title='하루 평균 사용시간' value='34:33' $grayColor />
        </GridBox>
        <StyledGrid title='유료회원 수' column={5}>
          <StyledCell title='프리미엄 요금제 가입자 수' value='620' />
          <StyledCell title='스탠다드 요금제 가입자 수' value='1150' />
          <StyledCell title='라이트 요금제 가입자 수' value='980' />
          <StyledCell title='유료가입 이탈자 수' value='150' />
          <StyledCell title='유료가입 이탈율' value='12%' />
        </StyledGrid>

        <StyledGrid title='TV 스펙' column={5}>
          <StyledCell title='O24 Chip(SoC 칩) 사양 TV 구매자 수' value='550' />
          <StyledCell title='O22 Chip(SoC 칩) 사양 TV 구매자 수' value='780' />
          <StyledCell title='K24 Chip(SoC 칩) 사양 TV 구매자 수' value='420' />
          <StyledCell title='외산 Chip(SoC 칩) 사양 TV 구매자 수' value='310' />
        </StyledGrid>

        <StyledGrid title='Connectivity' column={5}>
          <StyledCell title='USB 카메라 연결자 수' value='280' />
          <StyledCell title='DHD(Digital Healthcare Device) 연결자 수' value='150' />
        </StyledGrid>
      </GridContainer>
    </Container>
  );
};

export default Home;
