import { useState } from 'react';

import styled from 'styled-components';

import { DeleteHoverIcon, DeleteNorIcon } from '@src/assets/images';
import { Div, Icon } from '@src/components/atoms';
import { flex } from '@src/styles/variables';

const Wrapper = styled(Div)`
  ${flex({ gap: '12px' })}
`;

const ChipItem = styled(Div)`
  ${flex({ gap: '5px' })}
  padding: 9px 14px;
  border-radius: 56px;
  background-color: ${({ theme }) => theme.colors.green01};
`;

const IconWrapper = styled(Div)``;

const S = {
  Icon: styled(Icon)`
    width: 18px;
    height: 18px;
    cursor: pointer;
  `,
};

export interface InputChipProps {
  text: string;
  handleRemove: () => void;
}

const ClosableChip = ({ text, handleRemove }: InputChipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Wrapper>
      <ChipItem>
        {text}
        <IconWrapper
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleRemove}
        >
          <S.Icon icon={isHovered ? DeleteHoverIcon : DeleteNorIcon} />
        </IconWrapper>
      </ChipItem>
    </Wrapper>
  );
};

export default ClosableChip;
