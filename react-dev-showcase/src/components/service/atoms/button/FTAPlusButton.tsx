import styled from 'styled-components';

import { plusIcon } from '@assets/images';
import { Div, Img } from '@components/atoms';
import Button, { ButtonProps } from '@components/atoms/Button';
import { flex } from '@src/styles/variables';

const PlusButton = styled(Button)`
  ${flex({ gap: '2px' })}
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  padding: 6px 15px;
  border-radius: 46px;
  border: 1px solid ${({ theme }) => theme.colors.gray10};
  background-color: ${({ theme }) => theme.colors.gray01};
  color: ${({ theme }) => theme.colors.gray07};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray03};
  }

  &:disabled {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray01};
    }
  }
`;

const TextWrapper = styled(Div)``;

const FTAPlusButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <PlusButton {...rest}>
      <Img src={plusIcon} />
      <TextWrapper>{children}</TextWrapper>
    </PlusButton>
  );
};

export default FTAPlusButton;
