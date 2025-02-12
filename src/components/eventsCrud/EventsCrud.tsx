import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventsList from "../eventsList/EventsList";
import EventSearch from "../EventSearch";
import ContentTop from "../contentTop/ContentTop";
import FieldsModal from "../FieldsModal";

interface Field {
  key: string;
  name: string;
}

const EventsCrud: React.FC = () => {
  const navigate = useNavigate();

  const getInitialFieldsToDisplay = () => {
    const storedFields = localStorage.getItem("eventFieldsToDisplay");
    return storedFields
      ? JSON.parse(storedFields)
      : [
          { key: "placeId", name: "Nome do local" },
          { key: "event", name: "Evento" },
          { key: "type", name: "Tipo" },
          { key: "dateStart", name: "Data de início" },
          { key: "dateEnd", name: "Data de término" },
          { key: "gates", name: "Portões cadastrados" },
          { key: "email", name: "Email" },
        ];
  };

  const getInitialAvailableFields = () => {
    const storedFields = localStorage.getItem("availableEventFields");
    return storedFields
      ? JSON.parse(storedFields)
      : [
          { key: "turnstiles", name: "Catracas cadastradas" },
          { key: "phone", name: "Celular" },
        ];
  };

  const [eventFieldsToDisplay, setEventFieldsToDisplay] = useState<Field[]>(
    getInitialFieldsToDisplay
  );

  const [availableEventFields, setAvailableEventFields] = useState<Field[]>(
    getInitialAvailableFields
  );

  const [showModal, setShowModal] = useState(false);

  const handleAddEvent = () => {
    navigate("/edit-event/new");
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="mainContainer">
      <ContentTop
        title="Eventos"
        message="Confira os eventos cadastrados no sistema."
      />
      <div className="backgroundContainer">
        <div>
          <div className="customRowSpace">
            <EventSearch />
            <button onClick={handleShowModal}>Alterar visualização</button>
            <button onClick={handleAddEvent}>Adicionar evento</button>
          </div>
          <EventsList
            fieldsToDisplay={eventFieldsToDisplay}
            showTitles={true}
            showPagination={true}
          />
        </div>
      </div>
      <FieldsModal
        show={showModal}
        handleClose={handleCloseModal}
        type="event"
        fieldsToDisplay={eventFieldsToDisplay}
        setFieldsToDisplay={setEventFieldsToDisplay}
        availableFields={availableEventFields}
        setAvailableFields={setAvailableEventFields}
      />
    </div>
  );
};

export default EventsCrud;
