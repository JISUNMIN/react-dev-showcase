import {
  HTMLAttributes,
  Key,
  MouseEvent,
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { Div } from '@components/atoms';

const Wrapper = styled(Div)<HTMLAttributes<HTMLDivElement>>`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled(Div)<HTMLAttributes<HTMLDivElement>>`
  position: relative;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
`;

export type ModalContextProps = {
  modalContent: ReactNode;
  showModal: (content: ReactElement) => void;
  closeModal: (key: Key) => void;
  clearModal: () => void;
};

export type ModalProviderProps = {
  children: ReactNode;
};

const ModalContext = createContext<ModalContextProps | null>(null);

const ModalWrapper = ({ children }: ModalProviderProps) => {
  const modal = document.getElementById('modal');
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModalProvider 은 반드시 ModalProvider안에서 사용해야 합니다.');
  }

  const { closeModal } = context;

  const handleModalBodyOnClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!modal) return null;

  const key = (children as ReactElement)?.key;
  const condition = key !== null && key !== undefined;
  return createPortal(
    <Wrapper onClick={() => condition && closeModal(key)}>
      <ModalBox onClick={handleModalBodyOnClick}>{children}</ModalBox>
    </Wrapper>,
    modal
  );
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalContent, setModalContent] = useState<ReactElement[]>([]);

  const showModal = useCallback((modalComponent: ReactElement) => {
    setModalContent((content) => [...content, modalComponent]);
  }, []);

  const closeModal = useCallback((key: Key) => {
    setModalContent((content) => content.filter((modalComponent: ReactElement) => modalComponent?.key !== key));
  }, []);

  const clearModal = useCallback(() => {
    setModalContent([]);
  }, []);

  const contextValues: ModalContextProps = {
    modalContent,
    showModal,
    closeModal,
    clearModal,
  };

  return (
    <ModalContext.Provider value={contextValues}>
      {children}
      {modalContent.length > 0 && modalContent.map((modal) => <ModalWrapper key={modal.key}>{modal}</ModalWrapper>)}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal 는 반드시 ModalProvider안에서 사용해야 합니다.');
  }
  return context;
};
