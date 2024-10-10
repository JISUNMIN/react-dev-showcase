import styled from 'styled-components';

import { videoStartIcon } from '@assets/images';
import { Div, Img } from '@components/atoms';
import Button, { ButtonProps } from '@components/atoms/Button';
import { flex } from '@src/styles/variables';

const PlayButton = styled(Button)`
  ${flex({ gap: '4px' })}
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  padding: 10px 14px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.gray03};
  color: ${({ theme }) => theme.colors.gray07};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray05};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray03};
    opacity: 0.4;
  }
`;

const TextWrapper = styled(Div)``;

const FTAPlayButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <PlayButton {...rest}>
      <Img src={videoStartIcon} />
      <TextWrapper>{children}</TextWrapper>
    </PlayButton>
  );
};

export default FTAPlayButton;
