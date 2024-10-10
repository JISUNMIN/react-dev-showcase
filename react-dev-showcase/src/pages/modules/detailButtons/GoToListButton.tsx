import styled from 'styled-components';

import { FTALineButton } from '@src/components';
import { font } from '@src/styles/variables';

import type { OnlyOnClick } from './type';

const DetailLineButton = styled(FTALineButton)`
  ${font({ size: '16px', weight: '700' })}
  padding: 15px 18px;
`;

const GoToListButton = ({ onClick }: OnlyOnClick) => {
  return <DetailLineButton onClick={onClick}>목록</DetailLineButton>;
};

export default GoToListButton;
