import styled from 'styled-components';

import { exportIcon } from '@assets/images';
import { Div, Img } from '@components/atoms';
import Button, { ButtonProps } from '@components/atoms/Button';
import { flex } from '@src/styles/variables';

const ExportButton = styled(Button)`
  ${flex({ gap: '4px' })}
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  padding: 10px 14px;
  border-radius: 8px;
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

const FTAExportButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <ExportButton {...rest}>
      <Img src={exportIcon} />
      <TextWrapper>{children}</TextWrapper>
    </ExportButton>
  );
};

export default FTAExportButton;
