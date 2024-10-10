import styled from 'styled-components';

import { Div } from '@src/components/atoms';
import { ColorsTypes } from '@src/styles/themes';
import { absolute, flex, font, size } from '@src/styles/variables';

export interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
  /* 현재 step의 라벨 및 선 색상 */
  activeColor?: keyof ColorsTypes;
  /* circle 위 라벨 ex) ['라벨1', '라벨2'] */
  stepLabels?: Array<string>;
}

const ProgressContainer = styled(Div)`
  margin-left: calc(100% - 50vw);
  ${flex({ gap: '0px', justify: 'left' })};
`;

const ProgressBox = styled(Div)`
  width: 200px;
  text-align: center;
  position: relative;
  ${flex({ direction: 'column', align: 'center', gap: '0px' })};
`;

const ProgressLabel = styled(Div)<{ $isActive: boolean; $activeColor: keyof ColorsTypes }>`
  width: 100%;
  margin: -40px 0 8px 0;
  ${absolute({ left: '-100px' })};
  color: ${({ theme, $isActive, $activeColor }) => ($isActive ? theme.colors[$activeColor] : theme.colors.gray06)};
  ${({ $isActive }) =>
    font({
      size: '14px',
      weight: $isActive ? 'bold' : 'normal',
    })}
`;

const ProgressStep = styled(Div)`
  width: 100%;
  ${flex({ align: 'center', gap: '0px', justify: 'flex-start' })};
`;

const ProgressLine = styled(Div)<{ $isActive: boolean; $activeColor: keyof ColorsTypes }>`
  flex-grow: 1;
  ${size({ w: '100%', h: '2px' })};
  background: ${({ theme, $isActive, $activeColor }) => ($isActive ? theme.colors[$activeColor] : theme.colors.gray06)};
`;

const ProgressCircle = styled(Div)<{ $isActive: boolean; $activeColor: keyof ColorsTypes }>`
  ${flex({})};
  ${size({ w: '10px' })};
  border-radius: 50%;
  background: ${({ theme, $isActive, $activeColor }) => ($isActive ? theme.colors[$activeColor] : theme.colors.gray06)};
`;

const ProgressBar = ({ totalSteps, currentStep, activeColor = 'brown03', stepLabels = [] }: ProgressBarProps) => {
  return (
    <ProgressContainer>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepIndex = i + 1;
        const isActive = stepIndex <= currentStep;
        const isActiveLine = stepIndex < currentStep;

        return (
          <ProgressBox key={stepIndex}>
            <ProgressLabel $isActive={isActive} $activeColor={activeColor}>
              {stepLabels[stepIndex - 1] || ''}
            </ProgressLabel>
            <ProgressStep>
              <ProgressCircle $isActive={isActive} $activeColor={activeColor} />
              {stepIndex < totalSteps && <ProgressLine $isActive={isActiveLine} $activeColor={activeColor} />}
            </ProgressStep>
          </ProgressBox>
        );
      })}
    </ProgressContainer>
  );
};

export default ProgressBar;
