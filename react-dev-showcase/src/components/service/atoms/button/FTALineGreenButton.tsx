import styled from 'styled-components';

import Button, { ButtonProps } from '@components/atoms/Button';

const LineGreenButton = styled(Button)`
  font-size: 16px;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.colors.green02};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.green02};
  padding: 16px 20px;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.green02};
    color: ${({ theme }) => theme.colors.green02};
    background-color: ${({ theme }) => theme.colors.green01};
  }
  &:disabled {
    border: 2px solid ${({ theme }) => theme.colors.gray05};
    color: ${({ theme }) => theme.colors.gray05};
    background-color: ${({ theme }) => theme.colors.gray01};
  }
`;

const FTALineGreenButton = ({ children, ...rest }: ButtonProps) => {
  return <LineGreenButton {...rest}>{children}</LineGreenButton>;
};

export default FTALineGreenButton;
