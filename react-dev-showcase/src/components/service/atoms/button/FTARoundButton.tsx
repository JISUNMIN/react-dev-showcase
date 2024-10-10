import styled from 'styled-components';

import Button, { ButtonProps } from '@components/atoms/Button';

const RoundButton = styled(Button)`
  padding: 20px 16px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray08};
  background-color: ${({ theme }) => theme.colors.gray03};

  &:hover {
    text-decoration: underline;
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.gray05};
    background-color: ${({ theme }) => theme.colors.gray03};
    text-decoration: none;
  }
`;

const FTARoundButton = ({ children, ...rest }: ButtonProps) => {
  return <RoundButton {...rest}>{children}</RoundButton>;
};

export default FTARoundButton;
