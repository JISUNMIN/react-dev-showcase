import styled from 'styled-components';

import Button, { ButtonProps } from '@components/atoms/Button';

const TextButton = styled(Button)`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray07};

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.gray09};
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.gray04};
    text-decoration: none;
  }
`;

const FTATextButton = ({ children, ...rest }: ButtonProps) => {
  return <TextButton {...rest}>{children}</TextButton>;
};

export default FTATextButton;
