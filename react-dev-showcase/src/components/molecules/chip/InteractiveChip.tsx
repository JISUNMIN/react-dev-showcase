import { useCallback, useState } from 'react';

import styled from 'styled-components';

import { Div } from '@src/components/atoms';

export interface ChipProps {
  contents: string;
  disabled: boolean;
}

const Wrapper = styled(Div)``;

const InteractiveItem = styled(Div)<{ disabled?: boolean; isSelected: boolean }>`
  padding: 7px 12px 7px 12px;
  border-radius: 8px;

  background-color: ${({ theme, isSelected }) => (isSelected ? theme.colors.brown01 : theme.colors.gray02)};
  color: ${({ theme, isSelected }) => (isSelected ? theme.colors.brown03 : theme.colors.gray07)};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  cursor: ${({ disabled }) => (disabled ? '' : 'pointer')};
  user-select: none;

  &:hover {
    background-color: ${({ theme, disabled, isSelected }) => !disabled && !isSelected && theme.colors.gray03};
  }
`;

const InteractiveChip = ({ contents, disabled }: ChipProps) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelectStatus = useCallback(() => {
    disabled ? setIsSelected(false) : setIsSelected(!isSelected);
  }, [isSelected, disabled]);

  return (
    <Wrapper onClick={handleSelectStatus}>
      <InteractiveItem isSelected={!disabled && isSelected} disabled={disabled}>
        {contents}
      </InteractiveItem>
    </Wrapper>
  );
};

export default InteractiveChip;
