import styled from 'styled-components';

import { FTALineButton } from '@src/components';
import { font } from '@src/styles/variables';

import type { OnlyOnClick } from './type';

const DetailLineButton = styled(FTALineButton)`
  ${font({ size: '16px', weight: '700' })}
  padding: 15px 18px;
`;

const GoToEditButton = ({ onClick }: OnlyOnClick) => {
  return <DetailLineButton onClick={onClick}>수정</DetailLineButton>;
};

export default GoToEditButton;
