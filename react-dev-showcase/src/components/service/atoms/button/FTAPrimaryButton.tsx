import styled, { css } from 'styled-components';

import Button, { ButtonProps } from '@components/atoms/Button';

export const PrimaryButtonStyle = css`
  padding: 20px 16px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray01};
  background-color: ${({ theme }) => theme.colors.gray10};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray09};
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.gray05};
    background-color: ${({ theme }) => theme.colors.gray04};
  }
`;

const PrimaryButton = styled(Button)`
  ${PrimaryButtonStyle}
`;

const FTAPrimaryButton = ({ children, ...rest }: ButtonProps) => {
  return <PrimaryButton {...rest}>{children}</PrimaryButton>;
};

export default FTAPrimaryButton;
