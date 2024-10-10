import styled from 'styled-components';

import { Div, Text } from '@components/index';
import { absolute, flex, size } from '@src/styles/variables';

interface LineChartBottomLegendProps {
  id: string;
  label: string;
  checked: boolean;
  color: string;
  onChange: () => void;
  enableToggle?: boolean;
}

const Container = styled(Div)`
  display: flex;
`;

const Input = styled.input`
  display: none;
`;

const Label = styled.label<{ enableToggle: boolean }>`
  user-select: none;
  ${flex({ gap: '6px', align: '' })}

  ${({ enableToggle }) => enableToggle && `cursor: pointer;`};
`;

const LabelIconContainer = styled(Div)<{ color: string }>`
  --color: ${({ color }) => color};
  --horizontal-line-width: 12px;
  ${flex({})}
  position: relative;
`;

const Dot = styled(Div)`
  --dot-diameter: 6px;
  --dot-border: 1.5px;

  ${absolute({
    top: 'calc(((var(--dot-diameter)) / 2) + var(--dot-border))',
    left: 'calc(((var(--horizontal-line-width) - var(--dot-diameter)) / 2))',
  })}

  width: var(--dot-diameter);
  aspect-ratio: 1;
  border-radius: 50%;
  border: var(--dot-border) solid var(--color);
  background-color: ${({ theme }) => theme.colors.gray01};
`;

const HorizontalLine = styled(Div)`
  ${size({ w: 'var(--horizontal-line-width)', h: '2px' })}
  border-radius: 1px;
  background-color: var(--color);
`;

const LabelText = styled(Text)``;

const LineChartBottomLegend = ({
  id,
  label,
  checked,
  color,
  onChange,
  enableToggle = false,
}: LineChartBottomLegendProps) => {
  const handleOnChange = () => {
    if (!enableToggle) return;
    onChange && onChange();
  };

  return (
    <Container>
      <Input type='checkbox' checked={checked} id={`${id}-bottom-legend`} onChange={handleOnChange} />
      <Label htmlFor={`${id}-bottom-legend`} enableToggle={enableToggle}>
        <LabelIconContainer color={color}>
          <Dot />
          <HorizontalLine />
        </LabelIconContainer>
        <LabelText>{label}</LabelText>
      </Label>
    </Container>
  );
};

export default LineChartBottomLegend;
