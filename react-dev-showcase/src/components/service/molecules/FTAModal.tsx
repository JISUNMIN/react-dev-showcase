import { Modal } from '@src/components/molecules';
import { ModalProps } from '@src/components/molecules/Modal';

interface FTAModalProps extends ModalProps {}

const FTAModal = ({ ...rest }: FTAModalProps) => {
  return <Modal {...rest} />;
};

FTAModal.displayName = 'FTAModal';

export default FTAModal;
