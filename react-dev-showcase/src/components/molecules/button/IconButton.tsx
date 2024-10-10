import { forwardRef } from 'react';

import styled from 'styled-components';

import { Button, Icon } from '@components/atoms';
import { IconProps } from '@components/atoms/Icon';

interface IconButtonProps extends IconProps {
  onClick?: () => void;
}

const IconWrapper = styled(Button)``;

const IconButton = forwardRef<HTMLDivElement, IconButtonProps>(({ ...rest }, ref) => {
  return (
    <IconWrapper {...rest}>
      <Icon {...rest} ref={ref} />
    </IconWrapper>
  );
});

export default IconButton;
