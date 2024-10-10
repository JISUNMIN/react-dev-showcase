import { useCallback } from 'react';

import styled from 'styled-components';

import { FTALineButton } from '@src/components';
import { useModal } from '@src/hooks';
import { font } from '@src/styles/variables';

import DetailButtonModal from './DetailButtonModal';
import type { DetailButtonProps } from './type';

const RefusalLineButton = styled(FTALineButton)`
  ${font({ size: '16px', weight: '700' })}
  padding: 15px 18px;
`;

const MODAL_KEY = 'DELETE';

const RefusalButton = ({ handleConfirm }: DetailButtonProps) => {
  const { showModal, closeModal } = useModal();

  const handleCancelClick = useCallback(() => {
    closeModal(MODAL_KEY);
  }, [closeModal]);

  const handleConfirmClick = useCallback(() => {
    handleConfirm();
  }, [handleConfirm]);

  const handleEditButtonClick = () => {
    showModal(
      <DetailButtonModal
        title='반려'
        key={MODAL_KEY}
        handleClose={handleCancelClick}
        bodyText={'반려하시겠습니까?'}
        hasMessage
        handleCancel={handleCancelClick}
        handleConfirm={handleConfirmClick}
      />
    );
  };

  return <RefusalLineButton onClick={handleEditButtonClick}>반려</RefusalLineButton>;
};

export default RefusalButton;
