import { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import styled, { css } from 'styled-components';

import { Div, FTALineButton, FTAPrimaryButton, Modal, RHFTextArea, Text } from '@src/components';
import { font } from '@src/styles/variables';

import type { DetailButtonProps } from './type';

const DetailButtonStyle = css`
  ${font({ size: '16px', weight: '700' })}
  padding: 15px 18px;
`;

const ModalBody = styled(Div)``;

const ModalBodyText = styled(Text)`
  ${font({ size: '18px', weight: '400' })}
  line-height: 1.17;
  color: ${({ theme }) => theme.colors.gray09};
`;

const ModalFooterContainer = styled(Div)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 10px;
`;

const CancelButton = styled(FTALineButton)`
  ${DetailButtonStyle}
`;

const ConfirmButton = styled(FTAPrimaryButton)`
  ${DetailButtonStyle}
`;

interface DetailButtonModalProps {
  title: string;
  handleClose: () => void;
  handleCancel: () => void;
  handleConfirm: () => void;
  bodyText: NonNullable<DetailButtonProps['bodyText']>;
  hasMessage?: boolean;
}

interface TextAreaProps {
  message: string;
}

// FIXME style에 대한 정의 없음
const RHFDetailModalTextArea = styled(RHFTextArea)`
  margin-top: 16px;
  width: 330px;
  height: 150px;
`;

// FIXME: 현재는 미구현된 기능으로, 반려 시 반려사유 입력을 해야되면 구현할 예정
const DetailModalTextArea = ({ hasMessage }: Pick<DetailButtonModalProps, 'hasMessage'>) => {
  const formInstance = useForm();

  useEffect(() => {
    formInstance.resetField('message', {
      defaultValue: '현재는 미구현된 기능으로, 반려 시 반려사유 입력을 해야되면 구현할 예정',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasMessage) {
    return null;
  }

  return (
    <FormProvider {...formInstance}>
      <RHFDetailModalTextArea name='message' maxByte={1000} />
    </FormProvider>
  );
};

const DetailButtonModal = ({
  title,
  handleClose,
  handleCancel,
  handleConfirm,
  bodyText,
  hasMessage = false,
}: DetailButtonModalProps) => {
  return (
    <Modal
      title={title}
      handleClose={handleClose}
      footerChildren={
        <ModalFooterContainer>
          <CancelButton onClick={handleCancel}>취소</CancelButton>
          <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
        </ModalFooterContainer>
      }
    >
      <ModalBody>
        {typeof bodyText === 'string' ? (
          <ModalBodyText>{bodyText}</ModalBodyText>
        ) : (
          bodyText.map((text, index) => <ModalBodyText key={index}>{text}</ModalBodyText>)
        )}
        <DetailModalTextArea hasMessage={hasMessage} />
      </ModalBody>
    </Modal>
  );
};

export default DetailButtonModal;
