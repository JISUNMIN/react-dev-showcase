import { ChangeEvent, ReactNode, forwardRef } from 'react';

import styled from 'styled-components';

import Input from '@src/components/atoms/Input';
import type { InputProps } from '@src/components/atoms/Input';

export interface RadioProps extends InputProps {
  children: ReactNode;
}

const PlainLabel = styled.label<{ disabled?: boolean }>`
  position: relative;
  user-select: none;
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};
  opacity: ${({ disabled }) => disabled && `0.5`};
`;

const StyledInput = styled(Input)`
  appearance: none;
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.gray06} !important;

  opacity: ${({ disabled }) => disabled && `0.7`};
  &:checked {
    background: ${({ theme }) => theme.colors.brown04};
  }
  &:disabled {
    padding: 0;
  }
`;

const Radio = forwardRef<HTMLInputElement, RadioProps>(({ onChange, children, disabled, ...rest }, ref) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event);
  };

  return (
    <PlainLabel disabled={disabled}>
      <StyledInput ref={ref} onChange={handleOnChange} disabled={disabled} {...rest} type='radio' />
      {children}
    </PlainLabel>
  );
});

Radio.displayName = 'Radio';

export default Radio;
