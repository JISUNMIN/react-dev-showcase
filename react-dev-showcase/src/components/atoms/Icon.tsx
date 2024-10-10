import { ComponentProps, forwardRef } from 'react';

import styled, { CSSObject, css } from 'styled-components';

import Div from '@components/atoms/Div';

export interface IconProps extends ComponentProps<'div'> {
  disabled?: boolean;
  isLoading?: boolean;
  icon?: string;
  pointer?: boolean;
  classes?: CSSObject;
}

const baseStyles = css`
  display: inline-block;
  vertical-align: middle;
  border: 0;
  padding: 0;
  font-size: 0;
  background: no-repeat center/cover;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const dynamicStyles = ({ disabled, isLoading, icon }: IconProps) => css`
  ${baseStyles}
  opacity: ${disabled ? '0.333' : '1'};
  background-image: ${!isLoading ? `url(${icon})` : 'none'};
  cursor: inherit;
  cursor: ${disabled && 'not-allowed'};
`;

const StyledIcon = styled(Div)<IconProps>`
  ${dynamicStyles}
`;

const Icon = forwardRef<HTMLDivElement, IconProps>(({ isLoading = false, ...rest }, ref) => (
  <StyledIcon ref={ref} isLoading={isLoading} {...rest} />
));

Icon.displayName = 'Icon';

export default Icon;
