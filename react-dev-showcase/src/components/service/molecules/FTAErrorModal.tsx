import styled from 'styled-components';

import { CloseIcon, EmptyIcon } from '@src/assets/images';
import { Div, Icon, Img, Modal, Span } from '@src/components';
import { ModalProps } from '@src/components/molecules/Modal';
import { flex, font } from '@src/styles/variables';

interface FTAModalImgProps extends ModalProps {}

const ModalContainer = styled(Div)`
  ${flex({ direction: 'column' })};
  min-width: 300px;
`;

const ModalHeader = styled(Div)`
  ${flex({ align: 'center' })};
  ${font({ size: '18px' })}
  width: 100%;
  padding-bottom: 15px;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray11};
`;

const HeaderTitle = styled(Div)`
  flex: 1;
`;

const CloseButton = styled(Div)`
  cursor: pointer;
  right: 15px;
  top: 25%;
`;

const CloseIco = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const ImageArea = styled(Span)`
  ${flex({})};
  width: 100%;
  padding: 20px;
`;

const FTAErrorModal = ({ handleClose, ...rest }: FTAModalImgProps) => {
  return (
    <Modal {...rest}>
      <ModalContainer>
        <ModalHeader>
          <HeaderTitle>Error</HeaderTitle>
          {handleClose && (
            <CloseButton onClick={handleClose}>
              <CloseIco icon={CloseIcon} />
            </CloseButton>
          )}
        </ModalHeader>
        <ImageArea>
          <Img src={EmptyIcon} />
        </ImageArea>
        서버 오류가 발생하였습니다.
      </ModalContainer>
    </Modal>
  );
};

FTAErrorModal.displayName = 'FTAErrorModal';

export default FTAErrorModal;
