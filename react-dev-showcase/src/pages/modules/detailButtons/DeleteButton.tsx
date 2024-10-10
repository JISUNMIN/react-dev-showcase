import { useCallback } from 'react';

import styled from 'styled-components';

import { FTALineButton } from '@src/components';
import { useModal } from '@src/hooks';
import { font } from '@src/styles/variables';

import DetailButtonModal from './DetailButtonModal';
import type { DetailButtonProps } from './type';

const DeleteLineButton = styled(FTALineButton)`
  ${font({ size: '16px', weight: '700' })}
  padding: 15px 18px;
`;

const MODAL_KEY = 'DELETE';

const DeleteButton = ({ handleConfirm, bodyText }: DetailButtonProps) => {
  const { showModal, closeModal } = useModal();

  const text = bodyText ?? '등록된 정보를 삭제하시겠습니까?';

  const handleCancelClick = useCallback(() => {
    closeModal(MODAL_KEY);
  }, [closeModal]);

  const handleConfirmClick = useCallback(() => {
    handleConfirm();
  }, [handleConfirm]);

  const handleEditButtonClick = () => {
    showModal(
      <DetailButtonModal
        title='삭제'
        key={MODAL_KEY}
        handleClose={handleCancelClick}
        bodyText={text}
        handleCancel={handleCancelClick}
        handleConfirm={handleConfirmClick}
      />
    );
  };

  return <DeleteLineButton onClick={handleEditButtonClick}>삭제</DeleteLineButton>;
};

export default DeleteButton;
