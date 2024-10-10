import { ChangeEvent, ReactNode } from 'react';

import styled, { CSSObject } from 'styled-components';

import { checkBoxCheckedIcon, checkBoxUncheckedIcon } from '@src/assets/images';
import type { InputProps } from '@src/components/atoms/Input';

import Div from './Div';
import Input from './Input';

export interface CheckboxProps extends InputProps {
  name: string;
  children?: ReactNode;
  classes?: CSSObject;
}

interface ContainerProps {
  disabled?: boolean;
  size?: number;
}

const Container = styled(Div)`
  display: inline-flex;
  align-items: center;
`;

const HiddenCheckbox = styled(Input)`
  opacity: 0;
  position: absolute;
  &:checked + label {
    &::before {
      background-image: url(${checkBoxCheckedIcon});
    }
    /* NOTE: checked 된 상태에서 disabled 시 스타일 정의 없어서 임시 지정(GUI) */
    opacity: ${({ disabled }) => disabled && 0.5};
    cursor: ${({ disabled }) => disabled && 'not-allowed'};
  }
`;

const PlainLabel = styled.label<ContainerProps>`
  display: inline-flex;
  align-items: center;
  position: relative;
  user-select: none;
  padding-left: 24px;
  height: 20px;
  padding-top: 1px;
  cursor: pointer;

  /* NOTE: Hover 시 정의 없음(GUI) */
  /* &:hover {
    font-weight: ${({ disabled }) => !disabled && 'bold'};
  } */

  opacity: ${({ disabled }) => disabled && `0.5`};
  font-size: ${({ size }) => size && `${size}px`};

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 20px;
    height: 20px;
    background: url(${checkBoxUncheckedIcon}) no-repeat center;
    background-size: contain;
    transform: translateY(-50%);
  }
`;

const Checkbox = ({ onChange, name = 'defaultCheckbox', children, value, ...rest }: CheckboxProps) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event);
  };

  return (
    <Container {...rest}>
      <HiddenCheckbox id={name} name={name} onChange={handleOnChange} {...rest} type='checkbox' />
      <PlainLabel htmlFor={name}>{children ?? value}</PlainLabel>
    </Container>
  );
};

Checkbox.displayName = 'Checkbox';

export default Checkbox;
