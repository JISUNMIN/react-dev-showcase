import { HTMLAttributes, ReactNode } from 'react';

import styled from 'styled-components';

import { Div, Icon } from '@components/atoms';
import { CloseIcon } from '@src/assets/images';
import { flex, font, size } from '@src/styles/variables';

export interface ModalProps {
  children?: ReactNode;
  footerChildren?: ReactNode;
  title?: string;
  handleClose?: () => void;
}

const PlainModal = styled(Div)`
  position: relative;
  min-width: 370px;
`;

const CloseButton = styled(Div)<HTMLAttributes<HTMLDivElement>>`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray10};
  ${font({ size: '18px', weight: '700' })}
`;

const CloseButtonIcon = styled(Icon)`
  ${size({ w: '20px' })};
`;

const ModalHeader = styled(Div)<{ $title?: string }>`
  ${flex({
    direction: 'column',
    justify: `${({ title }: { title?: string }) => (title ? 'center' : 'flex-end')}`,
  })}
  ${font({ size: '18px', weight: '700', family: 'LG-smart-UI' })}
  position: relative;
  border-bottom: ${({ theme, $title }) => ($title ? `1px solid ${theme.colors.gray11}` : 'none')};
  padding-bottom: 17px;
`;

const ModalContent = styled(Div)`
  ${flex({})}
  ${font({ size: '16px', weight: '400', family: 'LG-smart-UI' })}
  padding-top: 10px;
  margin: 20px 0;
  word-break: break-all;
`;

const ModalFooter = styled(Div)`
  ${flex({})};
`;

const Modal = ({ children, footerChildren, title, handleClose }: ModalProps) => {
  return (
    <PlainModal>
      <ModalHeader $title={title}>
        {title && <Div>{title}</Div>}
        {handleClose && (
          <CloseButton onClick={handleClose}>
            <CloseButtonIcon icon={CloseIcon} />
          </CloseButton>
        )}
      </ModalHeader>
      <ModalContent>{children}</ModalContent>
      <ModalFooter>{footerChildren}</ModalFooter>
    </PlainModal>
  );
};

export default Modal;
