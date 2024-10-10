import { useState } from 'react';

import ApexCharts from 'react-apexcharts';
import styled, { useTheme } from 'styled-components';

import { Div, Text } from '@components/index';
import { flex, font, size } from '@src/styles/variables';

interface DonutChartProps {
  title: string;
  /** Donut chart 너비 ex : '300px', '50%' */
  width?: string;
  /** Donut chart 높이 ex : '300px', '50%' */
  height?: string;
  /** Donut chart 데이터 */
  series: number[];
  /** 도넛 차트의 각 조각에 대한 레이블을 나타내는 문자열 배열 */
  labels: string[];
  /** 도넛 차트의 각 색상 배열 ex : `['#FF0000', '#00FF00', '#0000FF']` */
  colors?: string[];
}

interface LegendMarkerProps {
  markerColor: string;
}

const Container = styled(Div)`
  display: flex;
  flex-direction: column;
  --padding: 32px;
  padding: var(--padding);
`;

const Title = styled(Text)`
  ${font({ size: '20px', weight: '700' })};
`;

const ChartWrapper = styled(Div)`
  ${flex({ gap: '120px' })};
  margin-top: 32px;
`;

const ReactApexChart = styled(ApexCharts)``;

const Legends = styled(Div)`
  display: grid;
  ${size({ w: '362px', h: '152px' })}
  -webkit-user-select: none;
  user-select: none;
`;

const LegendContainer = styled(Div)`
  ${flex({ justify: 'space-between' })}
`;

const LegendLeftSide = styled(Div)`
  display: flex;
`;

const LegendMarker = styled(Div)<LegendMarkerProps>`
  ${size({ w: '12px', h: '12px' })};
  border-radius: 50%;
  margin-right: 10px;
  ${({ markerColor }) => `background-color: ${markerColor}`}
`;

const LegendText = styled(Text)`
  ${font({ size: '16px', weight: '700' })};
  color: ${({ theme }) => theme.colors.gray07};
`;

const LegendRightSide = styled(Div)`
  display: flex;
`;

const VerticalLine = styled(Div)`
  ${size({ w: '1px', h: '14px' })};
  background: ${({ theme }) => theme.colors.gray05};
  margin: 0 10px;
`;

const LegendPercentage = styled(Text)`
  ${font({ size: '16px', weight: '700' })};
  color: ${({ theme }) => theme.colors.gray09};
`;

const TYPE = 'donut';

const DonutChart = ({ title, width = '100%', height = '100%', series = [], labels = [], colors }: DonutChartProps) => {
  const theme = useTheme();
  const [percentages, setPercentages] = useState<string[]>([]);
  const COLORS = colors?.length
    ? colors
    : [theme.colors.brown05, theme.colors.brown04, theme.colors.brown03, theme.colors.brown02, theme.colors.brown01];

  const handleMounted = ({ pie: { animDur: total, animBeginArr } }: never) => {
    const result: string[] = [];

    for (let i = 0; i < series.length; i += 1) {
      const value = animBeginArr[i + 1] - animBeginArr[i];
      result.push(((value / total) * 100).toFixed(1));
      setPercentages(result);
    }
  };

  return (
    <Container>
      <Title>{title}</Title>
      <ChartWrapper>
        <ReactApexChart
          type={TYPE}
          width={width}
          height={height}
          series={series}
          options={{
            chart: {
              type: TYPE,
              zoom: {
                enabled: false,
              },
              events: {
                mounted: handleMounted,
              },
            },
            colors: COLORS,
            legend: {
              show: false,
            },
            tooltip: {
              enabled: false,
            },
            dataLabels: {
              enabled: true,
              style: {
                fontFamily: 'LG-smart-UI',
                fontSize: '12px',
                fontWeight: '700',
                colors: [
                  theme.colors.gray01,
                  theme.colors.gray01,
                  theme.colors.gray01,
                  theme.colors.gray01,
                  theme.colors.brown03,
                ],
              },
              dropShadow: {
                enabled: false,
              },
            },
          }}
        />
        <Legends>
          {labels.map((label, index) => (
            <LegendContainer key={index}>
              <LegendLeftSide>
                <LegendMarker markerColor={COLORS[index % COLORS.length]} />
                <LegendText>{label}</LegendText>
              </LegendLeftSide>
              <LegendRightSide>
                <VerticalLine />
                <LegendPercentage>{`${percentages[index]}%`}</LegendPercentage>
              </LegendRightSide>
            </LegendContainer>
          ))}
        </Legends>
      </ChartWrapper>
    </Container>
  );
};

DonutChart.displayName = 'DonutChart';

export default DonutChart;
