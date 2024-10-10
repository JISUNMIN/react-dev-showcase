import { forwardRef } from 'react';

import styled from 'styled-components';

import { Span } from '@components/atoms';

export interface ToggleButtonProps {
  toggleState: boolean;
  onChange: () => void;
}

const ToggleSwitch = styled.label`
  position: relative;
  width: 40px;
  height: 20px;
`;

const ToggleSlider = styled(Span)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.gray05};
  border-radius: 10px;
  transition: 0.4s;
  cursor: pointer;

  &:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: ${({ theme }) => theme.colors.gray01};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${ToggleSlider} {
    background-color: ${({ theme }) => theme.colors.brown02};
  }

  &:checked + ${ToggleSlider}:before {
    transform: translateX(20px);
  }
`;

const ToggleButton = forwardRef<HTMLInputElement, ToggleButtonProps>(({ toggleState, onChange, ...rest }, ref) => {
  return (
    <ToggleSwitch {...rest}>
      <CheckBox ref={ref} type='checkbox' checked={toggleState} onChange={onChange} />
      <ToggleSlider />
    </ToggleSwitch>
  );
});

export default ToggleButton;
