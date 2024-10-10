import { ComponentPropsWithoutRef, forwardRef } from 'react';

import styled from 'styled-components';

import { useDebounceEvent } from '@hooks/index';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  debounce?: {
    enabled: boolean;
    delay: number;
  };
}

const PlainInput = styled.input`
  padding: 16px 22px;
  border: 1px solid ${({ theme }) => theme.gray04};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray06};
  }

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.gray06};
  }

  &:read-only {
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.gray07};
    border: 0px;
    padding: 0px;

    &:focus {
      outline: none;
    }
  }

  &:disabled {
    padding: 16px 22px;
    background-color: ${({ theme }) => theme.colors.gray03};
    border: 1px solid #dbd7d4;
    cursor: not-allowed;

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray05};
    }
  }
`;

const Input = forwardRef<HTMLInputElement, InputProps>(({ onChange, debounce, ...rest }, ref) => {
  const debouncedChange = useDebounceEvent(onChange, debounce);

  return <PlainInput ref={ref} onChange={debouncedChange} {...rest} />;
});

Input.displayName = 'Input';

export default Input;
