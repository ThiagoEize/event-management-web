import React from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "./ConfirmDeleteModal.module.css";

interface ConfirmDeleteModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  itemName: string;
  title: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  handleClose,
  handleConfirm,
  itemName,
  title,
}) => {
  const ModalComponent: any = Modal;
  const ModalHeader: any = Modal.Header;
  const ModalTitle: any = Modal.Title;
  const ModalBody: any = Modal.Body;
  const ModalFooter: any = Modal.Footer;
  const ButtonComponent: any = Button;

  return (
    <ModalComponent
      show={show}
      onHide={handleClose}
      centered
      dialogClassName={styles.modalDialog}
    >
      <div className={styles.modalContent}>
        <ModalHeader closeButton className={styles.modalHeader}>
          <ModalTitle className={styles.modalTitle}>Apagar {title}</ModalTitle>
        </ModalHeader>
        <ModalBody className={styles.modalBody}>
          Tem certeza que deseja apagar o {title} "{itemName}"?
        </ModalBody>
        <ModalFooter className={styles.modalFooter}>
          <ButtonComponent variant="secondary" onClick={handleClose}>
            Cancel
          </ButtonComponent>
          <ButtonComponent variant="danger" onClick={handleConfirm}>
            Delete
          </ButtonComponent>
        </ModalFooter>
      </div>
    </ModalComponent>
  );
};

export default ConfirmDeleteModal;
