import styled from 'styled-components';

import Button, { ButtonProps } from '@components/atoms/Button';

const LineButton = styled(Button)`
  padding: 20px 16px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;

  border: 2px solid ${({ theme }) => theme.colors.gray09};
  color: ${({ theme }) => theme.colors.gray10};

  &:hover {
    border: 2px solid ${({ theme }) => theme.colors.gray10};
    color: ${({ theme }) => theme.colors.gray10};
    background-color: ${({ theme }) => theme.colors.gray03};
  }
  &:disabled {
    border: 2px solid ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.gray05};
    background-color: ${({ theme }) => theme.colors.gray01};
  }
`;

const FTALineButton = ({ children, ...rest }: ButtonProps) => {
  return <LineButton {...rest}>{children}</LineButton>;
};

export default FTALineButton;
