import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import ConfirmDeleteModal from "../components/confirmDeleteModal/ConfirmDeleteModal";
import ResponseModal from "../components/responseModal/ResponseModal";

interface HelperContextProps {
  confirm: (message: string, title: string) => Promise<boolean>;
  showResponse: (title: string, message: string) => void;
}

const HelperContext = createContext<HelperContextProps | undefined>(undefined);

const HelperProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState<any>(null);

  const [response, setResponse] = useState<any>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  const handleClose = () => {
    if (modalProps?.resolve) {
      modalProps.resolve(false);
    }
    setShowModal(false);
    setModalProps(null);
  };

  const handleConfirm = () => {
    if (modalProps?.resolve) {
      modalProps.resolve(true);
    }
    setShowModal(false);
    setModalProps(null);
  };

  const confirm = (title: string, message: string) => {
    return new Promise<boolean>((resolve) => {
      setModalProps({ message, title, resolve });
      setShowModal(true);
    });
  };

  const showResponse = (title: string, message: string) => {
    setResponse({ title, message });
    setShowResponseModal(true);
  };

  useEffect(() => {
    if (showResponseModal) {
      const timer = setTimeout(() => {
        setShowResponseModal(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showResponseModal]);

  return (
    <HelperContext.Provider value={{ confirm, showResponse }}>
      {children}
      {showModal && modalProps && (
        <ConfirmDeleteModal
          show={true}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          itemName={modalProps.message}
          title={modalProps.title}
        />
      )}
      {showResponseModal && response && (
        <ResponseModal title={response.title} message={response.message} />
      )}
    </HelperContext.Provider>
  );
};

const useHelperContext = () => {
  const context = useContext(HelperContext);
  if (!context) {
    throw new Error("useHelperContext must be used within a HelperProvider");
  }
  return context;
};

export { HelperProvider, useHelperContext };
