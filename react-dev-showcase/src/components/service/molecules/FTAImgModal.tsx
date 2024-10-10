import styled from 'styled-components';

import { Div, Img, Modal, Span } from '@src/components';
import { ModalProps } from '@src/components/molecules/Modal';
import { flex, font } from '@src/styles/variables';

interface FTAModalImgProps extends ModalProps {
  imageSrc?: string;
}

const ModalContainer = styled(Div)`
  min-width: 800px;
  ${flex({ direction: 'column' })};
`;

const ImageArea = styled(Span)`
  width: 100%;
  min-height: 500px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-top: 20px;
  ${font({ size: '24px', weight: '700' })}
`;

const StyledImg = styled(Img)`
  width: 100%;
  height: 100%;
  object-fit: fill;
`;

const FTAImgModal = ({ imageSrc, ...rest }: FTAModalImgProps) => {
  return (
    <Modal {...rest}>
      <ModalContainer>
        <ImageArea>{imageSrc ? <StyledImg src={imageSrc} alt='Image Area' /> : 'Image Area'}</ImageArea>
      </ModalContainer>
    </Modal>
  );
};

FTAImgModal.displayName = 'FTAImgModal';

export default FTAImgModal;
