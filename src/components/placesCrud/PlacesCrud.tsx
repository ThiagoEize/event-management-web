import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlacesList from "../placesList/PlacesList";
import PlaceSearch from "../PlaceSearch";
import ContentTop from "../contentTop/ContentTop";
import FieldsModal from "../FieldsModal";

interface Field {
  key: string;
  name: string;
}

const PlacesCrud: React.FC = () => {
  const navigate = useNavigate();

  const [placeFieldsToDisplay, setPlaceFieldsToDisplay] = useState<Field[]>([
    { key: "name", name: "Nome do lugar" },
    { key: "address", name: "Endereço" },
    { key: "turnstiles", name: "Catracas cadastradas" },
    { key: "gates", name: "Portões cadastrados" },
  ]);

  const [placeAvailableFields, setPlaceAvailableFields] = useState<Field[]>([
    { key: "city", name: "Cidade" },
    { key: "state", name: "Estado" },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleAddPlace = () => {
    navigate("/edit-place/new");
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="mainContainer">
      <ContentTop
        title="Lugares"
        message="Confira os lugares cadastrados no sistema."
      />
      <div className="backgroundContainer">
        <div>
          <div className="customRowSpace">
            <PlaceSearch />
            <button onClick={handleShowModal}>Alterar visualização</button>
            <button onClick={handleAddPlace}>Adicionar local</button>
          </div>
          <PlacesList
            fieldsToDisplay={placeFieldsToDisplay}
            showTitles={true}
            showPagination={true}
          />
        </div>
      </div>
      <FieldsModal
        show={showModal}
        handleClose={handleCloseModal}
        type="place"
        fieldsToDisplay={placeFieldsToDisplay}
        setFieldsToDisplay={setPlaceFieldsToDisplay}
        availableFields={placeAvailableFields}
        setAvailableFields={setPlaceAvailableFields}
      />
    </div>
  );
};

export default PlacesCrud;
