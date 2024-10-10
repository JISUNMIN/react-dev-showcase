import styled from 'styled-components';

import Button, { ButtonProps } from '@components/atoms/Button';

const SecondaryButton = styled(Button)`
  padding: 20px 16px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray10};
  background-color: ${({ theme }) => theme.colors.gray02};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray04};
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.gray05};
    background-color: ${({ theme }) => theme.colors.gray02};
  }
`;

const FTASecondaryButton = ({ children, ...rest }: ButtonProps) => {
  return <SecondaryButton {...rest}>{children}</SecondaryButton>;
};

export default FTASecondaryButton;
