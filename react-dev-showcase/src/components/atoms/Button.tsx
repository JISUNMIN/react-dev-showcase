import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

import styled, { CSSObject } from 'styled-components';

import { useDebounceEvent } from '@hooks/index';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  debounce?: {
    enabled: boolean;
    delay: number;
  };
  classes?: CSSObject;
}

const PlainButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0px;
  cursor: pointer;
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, onClick, debounce, ...rest }, ref) => {
  const debouncedClick = useDebounceEvent(onClick, debounce);

  return (
    <PlainButton ref={ref} onClick={debouncedClick} {...rest}>
      {children}
    </PlainButton>
  );
});

Button.displayName = 'Button';

export default Button;
