import ReactApexChart from 'react-apexcharts';
import styled from 'styled-components';

import { Div } from '@components/index';

const Container = styled(Div)<{ width: string; height: string }>`
  ${({ width }) => `width: ${width};`}
  ${({ height }) => `height: ${height};`}
`;

const ApexCharts = styled(ReactApexChart)`
  position: relative;
`;

export interface BarChartProps {
  title?: string;
  titleFontSize?: string;
  width?: string;
  height?: string;
  barWidth?: string;
  /** Bar borderRadius */
  borderRadius?: number;
  /** Y축 범례 */
  series: Array<{ name: string; data: number[] }>;
  /** X축 범례 */
  categories: string[];
  /** 범례 컨테이너를 표시할지 숨길지 여부 */
  showLegend?: { top: boolean; bottom: boolean };
  showTooltip?: boolean;
  markersSize?: { size: number; strokeWidth: number };
  colors?: string[];
  enabledDataLabels?: boolean;
  /** 그리드 라인 숨기기 */
  showGrid?: boolean;
  /** Y축 눈금 숨기기 */
  showLabels?: boolean;
}

const BarChart = ({
  title: text,
  titleFontSize = '20px', // 제목 폰트 크기 기본값 설정
  width = '100%',
  height = '322px',
  barWidth = '17', // 기본 바 너비 설정,
  borderRadius,
  series = [],
  categories,
  showLegend = { top: true, bottom: true },
  showTooltip = true,
  markersSize = { size: 5, strokeWidth: 2 },
  colors = ['#B8A283', '#44655B'],
  enabledDataLabels = false,
  showGrid = true,
  showLabels = true,
}: BarChartProps) => {
  const options = {
    chart: {
      type: 'bar' as const, // TypeScript에서 타입 추론을 돕기 위해 'as const' 사용
      height: height,
      toolbar: {
        show: false,
      },
    },
    title: {
      text: text,
      style: {
        fontSize: titleFontSize, // 제목 폰트 크기 설정
      },
    },
    legend: {
      show: showLegend.top || showLegend.bottom,
      position: showLegend.top ? 'top' : 'bottom',
    },
    tooltip: {
      enabled: showTooltip,
    },
    markers: {
      size: markersSize.size,
      strokeWidth: markersSize.strokeWidth,
    },
    colors: colors,
    xaxis: {
      categories: categories,
    },
    yaxis: {
      labels: {
        show: showLabels, // Y축 눈금 숨기기
      },
    },
    plotOptions: {
      bar: {
        borderRadius: borderRadius ?? 0,
        borderRadiusApplication: 'end',
        columnWidth: barWidth, // 바 너비 설정 (퍼센트 값으로 설정)
      },
    },
    grid: {
      show: showGrid, // 그리드 라인 숨기기
    },
    dataLabels: {
      enabled: enabledDataLabels,
    },
  };

  return (
    <Container width={width} height={height}>
      <ApexCharts options={options} series={series} type='bar' height={height} />
    </Container>
  );
};

export default BarChart;
