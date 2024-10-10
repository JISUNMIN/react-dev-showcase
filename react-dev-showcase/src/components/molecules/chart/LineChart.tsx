import React, { useEffect, useMemo, useRef, useState } from 'react';

import ApexCharts from 'react-apexcharts';
import styled, { useTheme } from 'styled-components';

import { Checkbox, Div } from '@src/components';
import { FTAExportButton } from '@src/components/service/atoms';
import { absolute, flex, font, size } from '@src/styles/variables';

import LineChartBottomLegend from './LineChartBottomLegend';

interface LineChartProps {
  /** 차트 위에 들어가는 타이틀 string */
  title: string;
  /** 차트 width, 기본 값은 100% */
  width?: string;
  /** 차트 height, 기본 값은 408px */
  height?: string;
  /** Apex Chart에서 지원하는 series 배열, 그래프에 표현하고 싶은 데이터들의 집합 */
  series: Array<{
    name: string;
    data: number[];
  }>;
  /** Custom chart legend의 노출 여부를 결정, top은 우측 상단에 체크박스와 같이 표시되며 bottom은 그래프 하단 중앙에 표시 됨 */
  showLegend?: {
    top: boolean;
    bottom: boolean;
  };
  /** Custom chart tooltip의 노출 여부를 결정 */
  showTooltip?: boolean;
  /** Marker의 지름 */
  markersSize?: {
    size: number;
    strokeWidth: number;
  };
  /** Line의 색상들 */
  colors?: string[];
  /** Export 여부 */
  showExport?: boolean;
  /** Export 이름 */
  exportLabel?: string;
}

interface CustomTooltipProps {
  top: number;
  left: number;
  value: string;
  visible: boolean;
}

interface CustomTooltipContainerProps {
  customTooltip: {
    top: number;
    left: number;
  };
  markersSize: {
    size: number;
    strokeWidth: number;
  };
}

interface HandleMouseOverParams {
  w: {
    globals: {
      dom: {
        baseEl: HTMLElement;
      };
      series: number[][];
    };
  };
}
interface MouseOverProps {
  (
    event: React.MouseEvent<HTMLElement>,
    chartGlobals: HandleMouseOverParams, // 차트와 관련된 전역 데이터
    info: { seriesIndex: number; dataPointIndex: number }
  ): void;
}

const Container = styled(Div)<{ width: string; height: string }>`
  --padding: 32px;
  position: relative;
  padding: var(--padding);

  ${({ width }) => `width: ${width};`};
  ${({ height }) => `height: ${height};`};

  .apexcharts-tooltip,
  .apexcharts-xaxistooltip {
    display: none;
  }
`;

const ReactApexChart = styled(ApexCharts)`
  position: relative;
`;

const LegendContainer = styled(Div)`
  ${flex({ gap: '28px' })};
  ${absolute({ top: '32px', right: '32px' })}
  z-index: 99;
`;

const StyledExportButton = styled(FTAExportButton)``;

const CustomTooltipContainer = styled(Div)<CustomTooltipContainerProps>`
  --tooltip-width: 46px;
  --tooltip-height: 30px;

  ${size({ w: '--tooltip-width', h: '--tooltip-height' })}
  position: absolute;
  -webkit-user-select: none;
  user-select: none;
  border-radius: 6px;
  padding: 8px 10px;
  background-color: ${({ theme }) => theme.colors.gray09};

  ${({ customTooltip: { top, left }, markersSize }) =>
    `
    top: calc(${top}px - var(--tooltip-height) - 10px);
    left: calc(${left}px - (var(--tooltip-width) / 2) + ${(markersSize.size + markersSize.strokeWidth) / 2}px);
  `};
`;

const CustomTooltipTail = styled(Div)`
  --side-length: 6px;

  ${absolute({
    top: 'calc(var(--tooltip-height) - (var(--side-length) / 2))',
    left: 'calc((var(--tooltip-width) - var(--side-length)) / 2)',
  })}
  width: var(--side-length);
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.gray09};
  transform: rotate(45deg);
`;

const TooltipText = styled(Div)`
  ${font({ size: '11px', weight: '700' })}
  line-height: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray01};
`;

const BottomLegendContainer = styled(Div)`
  ${flex({ gap: '16px' })}
`;

const LineChart: React.FC<LineChartProps> = ({
  title,
  width = '100%',
  height = '408px',
  series = [],
  showLegend = { top: true, bottom: true },
  showTooltip = true,
  markersSize = { size: 5, strokeWidth: 2 },
  colors,
  showExport = true,
  exportLabel = '내보내기',
}) => {
  const theme = useTheme();
  const [seriesChecked, setSeriesChecked] = useState<boolean[]>(Array.from({ length: series.length }, () => true));
  const [containerCoords, setContainerCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [customTooltip, setCustomTooltip] = useState<CustomTooltipProps>({
    visible: false,
    top: 0,
    left: 0,
    value: '',
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ApexCharts | null>(null);
  const COLORS = colors?.length ? colors : [theme.colors.graphy01, theme.colors.graphy02, theme.colors.graphy03];

  const maxData = useMemo(() => Math.max(...series.map((elem) => Math.max(...elem.data))), [series]);

  const handleLegendCheckChange = ({ name, index }: { name: string; index: number }) => {
    const updatedCheckedState = seriesChecked.map((item, i) => (i === index ? !item : item));
    setSeriesChecked(updatedCheckedState);

    if (chartRef.current) {
      const chartInstance = chartRef.current.chart;
      chartInstance.toggleSeries(name);
    }
  };

  const handleExportButtonClick = () => {
    alert('내보내기 기능을 구현해야 합니다.');
  };

  const handleMouseOver: MouseOverProps = (event, { w }, { seriesIndex, dataPointIndex }) => {
    const {
      globals: {
        dom: { baseEl },
        series: targetSeries,
      },
    } = w;

    if (seriesIndex === -1 || dataPointIndex === -1 || !containerCoords.top || !containerCoords.left) return;

    const currentSeries = baseEl.querySelector(`.apexcharts-line-series >.apexcharts-series[zIndex="${seriesIndex}"]`);
    if (!currentSeries) return;
    const currentMarker = currentSeries.querySelector(`.apexcharts-marker[j="${dataPointIndex}"]`);
    if (!currentMarker) return;
    const { top: containerTop, left: containerLeft } = containerCoords;
    const { top: markerTop, left: markerLeft } = currentMarker.getBoundingClientRect();

    setCustomTooltip({
      visible: true,
      top: markerTop - containerTop,
      left: markerLeft - containerLeft,
      value: targetSeries[seriesIndex][dataPointIndex].toString(),
    });
  };

  const handleMouseLeave = () => {
    setCustomTooltip({ visible: false, top: 0, left: 0, value: '' });
  };

  useEffect(() => {
    if (containerRef.current) {
      const { top, left } = containerRef.current.getBoundingClientRect();
      setContainerCoords({ top, left });
    }
  }, []);

  return (
    <Container width={width} height={height} ref={containerRef} onMouseLeave={handleMouseLeave}>
      <LegendContainer>
        {showLegend.top &&
          series.map((elem, index) => (
            <Checkbox
              key={index}
              name={elem.name}
              checked={seriesChecked[index]}
              onChange={() => handleLegendCheckChange({ name: elem.name, index })}
            >
              {elem.name}
            </Checkbox>
          ))}
        {showExport && <StyledExportButton onClick={handleExportButtonClick}>{exportLabel}</StyledExportButton>}
      </LegendContainer>
      <ReactApexChart
        ref={chartRef}
        width='100%'
        height='100%'
        series={series}
        options={{
          title: {
            text: title,
            align: 'left',
            style: {
              fontSize: '18px',
            },
          },
          chart: {
            type: 'line',
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
            events: {
              mouseMove: handleMouseOver,
              mouseLeave: handleMouseLeave,
            },
          },
          colors: COLORS,
          stroke: {
            curve: 'smooth',
          },
          grid: {
            borderColor: theme.colors.gray04,
          },
          markers: {
            size: markersSize.size,
            colors: [theme.colors.gray01],
            strokeWidth: markersSize.strokeWidth,
            strokeColors: COLORS,
            hover: {
              size: markersSize.size,
            },
          },
          xaxis: {
            categories: [], // x축 라벨은 동적으로 받아야 합니다.
          },
          yaxis: {
            min: 0,
            max:
              // NOTE: max를 지정하지 않으면 legend toggle시 y축이 변경되는 문제가 있어서 max를 지정해줌
              Math.ceil(maxData / Math.pow(10, maxData.toString().length - 1)) *
              Math.pow(10, maxData.toString().length - 1),
          },
          legend: {
            show: false,
          },
          tooltip: {
            // NOTE: false로 하면 mouseMove event에서 dataPointIndex, seriesIndex을 받을 수 없음
            enabled: showTooltip,
          },
        }}
      />
      {showTooltip && customTooltip.visible && (
        <CustomTooltipContainer customTooltip={customTooltip} markersSize={markersSize}>
          <TooltipText>{customTooltip.value}</TooltipText>
          <CustomTooltipTail />
        </CustomTooltipContainer>
      )}
      {showLegend.bottom && (
        <BottomLegendContainer>
          {series.map((elem, index) => (
            <LineChartBottomLegend
              key={index}
              checked={seriesChecked[index]}
              onChange={() => handleLegendCheckChange({ name: elem.name, index })}
              id={elem.name}
              label={elem.name}
              color={COLORS[index % COLORS.length]}
            />
          ))}
        </BottomLegendContainer>
      )}
    </Container>
  );
};

export default LineChart;
