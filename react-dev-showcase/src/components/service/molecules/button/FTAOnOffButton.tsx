import styled, { DefaultTheme, css, useTheme } from 'styled-components';

import { graphBar, graphBarDisabled, graphLinear, graphLinearDisabled } from '@assets/images';
import OnOffButton, { OnOffButtonProps } from '@components/molecules/button/OnOffButton';
import { PseudoElement, flex } from '@src/styles/variables';

export interface FTAOnOffButtonProps extends OnOffButtonProps {
  isLeftActive: boolean;
}

const CreateButtonStyle = (isLeftActive: boolean, theme: DefaultTheme) => css`
  position: relative;
  flex: 1;
  height: 100%;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-color: ${isLeftActive ? theme.colors.brown01 : theme.colors.gray02};

  &:hover {
    &:after {
      ${PseudoElement({ width: '100%', height: '100%', top: '0px', left: '0px' })}
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const IconStyle = css`
  width: 17px;
  height: 17px;
`;

const ExtendedOnOffButton = styled(OnOffButton)`
  ${flex({ gap: '0px' })};
  width: 80px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
`;

const LeftButtonStyle = (isLeftActive: boolean, theme: DefaultTheme) => CreateButtonStyle(isLeftActive, theme);

const RightButtonStyle = (isLeftActive: boolean, theme: DefaultTheme) => CreateButtonStyle(!isLeftActive, theme);

const FTAOnOffButton = ({ isLeftActive, ...rest }: FTAOnOffButtonProps) => {
  const theme = useTheme();

  return (
    <ExtendedOnOffButton
      {...rest}
      classes={{
        LeftButton: LeftButtonStyle(isLeftActive, theme),
        RightButton: RightButtonStyle(isLeftActive, theme),
        Icon: IconStyle,
      }}
      isLeftActive={isLeftActive}
      leftIcon={isLeftActive ? graphBar : graphBarDisabled}
      rightIcon={!isLeftActive ? graphLinear : graphLinearDisabled}
    />
  );
};

export default FTAOnOffButton;
