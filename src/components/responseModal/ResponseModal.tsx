import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import styles from "./ResponseModal.module.css";

interface ResponseModalProps {
  title: string;
  message: string;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ title, message }) => {
  const ToastComponent: any = Toast;
  const ToastContainerComponent: any = ToastContainer;
  const ToastHeader: any = Toast.Header;
  const ToastBody: any = Toast.Body;

  // Determine the class name based on the title
  const toastClass =
    title === "Sucesso" ? styles.success : title === "Erro" ? styles.error : "";

  return (
    <ToastContainerComponent position="bottom-start">
      <ToastComponent
        className={`${toastClass}`}
        show={true}
        delay={5000}
        autohide
      >
        <ToastHeader>
          <strong className="me-auto">{title}</strong>
        </ToastHeader>
        <ToastBody>{message}</ToastBody>
      </ToastComponent>
    </ToastContainerComponent>
  );
};

export default ResponseModal;
