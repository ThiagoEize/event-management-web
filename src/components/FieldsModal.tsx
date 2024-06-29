import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { FaArrowsUpDown } from "react-icons/fa6";

interface Field {
  key: string;
  name: string;
}

interface FieldsModalProps {
  show: boolean;
  handleClose: () => void;
  type: "event" | "place";
  fieldsToDisplay: Field[];
  setFieldsToDisplay: (fields: Field[]) => void;
  availableFields: Field[];
  setAvailableFields: (fields: Field[]) => void;
}

const FieldsModal: React.FC<FieldsModalProps> = ({
  show,
  handleClose,
  type,
  fieldsToDisplay,
  setFieldsToDisplay,
  availableFields,
  setAvailableFields,
}) => {
  const [draggedField, setDraggedField] = useState<number | null>(null);
  const [draggedFromAvailable, setDraggedFromAvailable] =
    useState<boolean>(false);

  const storageKeyFieldsToDisplay =
    type === "event" ? "eventFieldsToDisplay" : "placeFieldsToDisplay";
  const storageKeyAvailableFields =
    type === "event" ? "availableEventFields" : "availablePlaceFields";

  const ModalComponent: any = Modal;
  const ModalHeader: any = Modal.Header;
  const ModalTitle: any = Modal.Title;
  const ModalBody: any = Modal.Body;
  const ModalFooter: any = Modal.Footer;
  const ListGroupComponent: any = ListGroup;
  const ListGroupItem: any = ListGroup.Item;
  const ButtonComponent: any = Button;

  useEffect(() => {
    const savedFieldsToDisplay = localStorage.getItem(
      storageKeyFieldsToDisplay
    );
    const savedAvailableFields = localStorage.getItem(
      storageKeyAvailableFields
    );
    if (savedFieldsToDisplay && savedAvailableFields) {
      setFieldsToDisplay(JSON.parse(savedFieldsToDisplay));
      setAvailableFields(JSON.parse(savedAvailableFields));
    }
  }, [
    storageKeyFieldsToDisplay,
    storageKeyAvailableFields,
    setFieldsToDisplay,
    setAvailableFields,
  ]);

  const handleDragStart = (index: any, fromAvailable: boolean) => {
    setDraggedField(index);
    setDraggedFromAvailable(fromAvailable);
  };

  const handleDrop = (index: any, toAvailable: boolean) => {
    if (draggedField === null) return;

    if (toAvailable !== draggedFromAvailable) {
      if (draggedFromAvailable) {
        const updatedAvailableFields = [...availableFields];
        const [addedField] = updatedAvailableFields.splice(draggedField, 1);
        const updatedFields = [...fieldsToDisplay];
        updatedFields.splice(index, 0, addedField);
        setFieldsToDisplay(updatedFields);
        setAvailableFields(updatedAvailableFields);
      } else {
        const updatedFields = [...fieldsToDisplay];
        const [removedField] = updatedFields.splice(draggedField, 1);
        const updatedAvailableFields = [...availableFields];
        updatedAvailableFields.splice(index, 0, removedField);
        setFieldsToDisplay(updatedFields);
        setAvailableFields(updatedAvailableFields);
      }
    } else {
      const updatedList = draggedFromAvailable
        ? [...availableFields]
        : [...fieldsToDisplay];
      const [removedField] = updatedList.splice(draggedField, 1);
      updatedList.splice(index, 0, removedField);

      if (draggedFromAvailable) {
        setAvailableFields(updatedList);
      } else {
        setFieldsToDisplay(updatedList);
      }
    }

    setDraggedField(null);
    setDraggedFromAvailable(false);
  };

  const handleRemoveField = (index: any) => {
    const updatedFields = [...fieldsToDisplay];
    const [removedField] = updatedFields.splice(index, 1);
    setFieldsToDisplay(updatedFields);
    setAvailableFields([...availableFields, removedField]);
  };

  const handleAddField = (index: any) => {
    const updatedAvailableFields = [...availableFields];
    const [addedField] = updatedAvailableFields.splice(index, 1);
    setAvailableFields(updatedAvailableFields);
    setFieldsToDisplay([...fieldsToDisplay, addedField]);
  };

  const handleSaveFields = () => {
    localStorage.setItem(
      storageKeyFieldsToDisplay,
      JSON.stringify(fieldsToDisplay)
    );
    localStorage.setItem(
      storageKeyAvailableFields,
      JSON.stringify(availableFields)
    );
    handleClose();
  };

  return (
    <ModalComponent show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <ModalTitle>Altere a vizualização da tabela</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p>
          Arraste os campos para mudar a ordem ou para retirar/inserir campos da
          lista de campos visíveis.
        </p>
        <h5>Campos visíveis</h5>
        <ListGroupComponent>
          {fieldsToDisplay.map((field, index) => (
            <ListGroupItem
              key={field.key}
              draggable
              onDragStart={() => handleDragStart(index, false)}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                e.preventDefault()
              }
              onDrop={() => handleDrop(index, false)}
            >
              <ButtonComponent
                variant="danger"
                size="sm"
                onClick={() => handleRemoveField(index)}
                style={{ marginRight: "10px" }}
              >
                <FaArrowsUpDown />
              </ButtonComponent>
              {field.name}
            </ListGroupItem>
          ))}
          {fieldsToDisplay.length === 0 && (
            <ListGroupItem
              draggable
              onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                e.preventDefault()
              }
              onDrop={() => handleDrop(0, false)}
              style={{ height: "40px" }}
            >
              <span>Arraste aqui para adicionar</span>
            </ListGroupItem>
          )}
        </ListGroupComponent>
        <h5 className="mt-4">Campos disponíveis</h5>
        <ListGroupComponent>
          {availableFields.map((field, index) => (
            <ListGroupItem
              key={field.key}
              draggable
              onDragStart={() => handleDragStart(index, true)}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                e.preventDefault()
              }
              onDrop={() => handleDrop(index, true)}
            >
              <ButtonComponent
                variant="success"
                size="sm"
                onClick={() => handleAddField(index)}
                style={{ marginRight: "10px" }}
              >
                <FaArrowsUpDown />
              </ButtonComponent>
              {field.name}
            </ListGroupItem>
          ))}
          {availableFields.length === 0 && (
            <ListGroupItem
              draggable
              onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                e.preventDefault()
              }
              onDrop={() => handleDrop(0, true)}
              style={{ height: "40px" }}
            >
              <span>Arraste aqui para adicionar</span>
            </ListGroupItem>
          )}
        </ListGroupComponent>
      </ModalBody>
      <ModalFooter>
        <ButtonComponent
          variant="secondary"
          onClick={handleClose}
          style={{ marginRight: "10px" }}
        >
          Close
        </ButtonComponent>
        <ButtonComponent variant="primary" onClick={handleSaveFields}>
          Save
        </ButtonComponent>
      </ModalFooter>
    </ModalComponent>
  );
};

export default FieldsModal;
