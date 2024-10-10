import styled, { CSSObject } from 'styled-components';

import { Button, Div, Icon } from '@components/atoms';

export interface OnOffButtonProps {
  leftIcon?: string;
  rightIcon?: string;
  isLeftActive: boolean;
  handleActive: (isLeftActive: boolean) => void;
  classes?: CSSObject;
}

const Container = styled(Div)``;

const LeftButtonWrapper = styled(Button)`
  ${({ classes }) => classes && classes.LeftButton}
`;

const RightButtonWrapper = styled(LeftButtonWrapper)`
  ${({ classes }) => classes && classes.RightButton}
`;

const ExtendedIcon = styled(Icon)`
  ${({ classes }) => classes && classes.Icon}
`;

const OnOffButton = ({ leftIcon, rightIcon, handleActive, classes, ...rest }: OnOffButtonProps) => {
  return (
    <Container {...rest}>
      <LeftButtonWrapper onClick={() => handleActive(true)} classes={classes}>
        <ExtendedIcon icon={leftIcon} classes={classes} />
      </LeftButtonWrapper>
      <RightButtonWrapper onClick={() => handleActive(false)} classes={classes}>
        <ExtendedIcon icon={rightIcon} classes={classes} />
      </RightButtonWrapper>
    </Container>
  );
};

export default OnOffButton;
