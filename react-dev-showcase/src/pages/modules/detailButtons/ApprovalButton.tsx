import { useCallback } from 'react';

import styled from 'styled-components';

import { FTAPrimaryButton } from '@src/components';
import { useModal } from '@src/hooks';
import { font } from '@src/styles/variables';

import DetailButtonModal from './DetailButtonModal';
import type { DetailButtonProps } from './type';

const EditPrimaryButton = styled(FTAPrimaryButton)`
  ${font({ size: '16px', weight: '700' })}
  padding: 15px 18px;
`;

const MODAL_KEY = 'APPROVAL';

const ApprovalButton = ({ handleConfirm }: DetailButtonProps) => {
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
        title='승인'
        key={MODAL_KEY}
        handleClose={handleCancelClick}
        bodyText={'승인하시겠습니까?'}
        handleCancel={handleCancelClick}
        handleConfirm={handleConfirmClick}
      />
    );
  };

  return <EditPrimaryButton onClick={handleEditButtonClick}>승인</EditPrimaryButton>;
};

export default ApprovalButton;
