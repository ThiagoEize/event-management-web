import React, { useState, useEffect } from "react";
import { useEventContext } from "../../context/EventContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useHelperContext } from "../../context/HelperContext";
import ContentTop from "../contentTop/ContentTop";
import styles from "./EventForm.module.css";

interface Place {
  id: number;
  name: string;
}

const EventForm: React.FC = () => {
  const { eventsList, addEvent, updateEvent } = useEventContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [placesList, setPlacesList] = useState<Place[]>([]);
  const [formState, setFormState] = useState({
    id: "",
    placeId: 0,
    event: "",
    type: "",
    email: "",
    phone: "",
    dateStart: "",
    hourStart: "",
    dateEnd: "",
    hourEnd: "",
  });

  const { showResponse } = useHelperContext();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(String(process.env.REACT_APP_API_URL));
        setPlacesList(response.data.data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (id) {
      const event = eventsList.find((event) => event.id.toString() === id);
      if (event) {
        const startDate = new Date(event.dateStart);
        const endDate = new Date(event.dateEnd);
        setFormState({
          id: event.id,
          placeId: event.placeId,
          event: event.event,
          type: event.type,
          email: event.email,
          phone: event.phone,
          dateStart: formatDate(startDate),
          hourStart: formatTime(startDate),
          dateEnd: formatDate(endDate),
          hourEnd: formatTime(endDate),
        });
      }
    }
  }, [id, eventsList]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMaskedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maskFunction: (value: string) => string
  ) => {
    const { name, value } = e.target;
    const maskedValue = maskFunction(value);
    setFormState((prev) => ({
      ...prev,
      [name]: maskedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDateStart = `${formatISODate(formState.dateStart)}T${
      formState.hourStart
    }:00`;
    const formattedDateEnd = `${formatISODate(formState.dateEnd)}T${
      formState.hourEnd
    }:00`;

    console.log("formattedDateStart:", formattedDateStart);
    console.log("formattedDateEnd:", formattedDateEnd);

    try {
      const eventData = {
        ...formState,
        placeId: Number(formState.placeId),
        dateStart: new Date(formattedDateStart).toISOString(),
        dateEnd: new Date(formattedDateEnd).toISOString(),
      };

      if (formState.id) {
        updateEvent(formState.id, eventData);
      } else {
        addEvent({ ...eventData, id: Date.now().toString() });
      }
    } catch (error) {
      showResponse("Erro", "Data ou horas inválidas");
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatISODate = (date: string) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const maskDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{4})\d+?$/, "$1");
  };

  const maskTime = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1:$2")
      .replace(/(\d{2})\d+?$/, "$1");
  };

  return (
    <div className="formContainer">
      <ContentTop title="Editar Evento" message="*Campos obrigatórios." />
      <div className="backgroundContainer">
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.inputLabel}>
              <label>Evento*</label>
              <input
                type="text"
                name="event"
                placeholder="Evento"
                value={formState.event}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputLabel}>
              <label>Tipo*</label>
              <input
                type="text"
                name="type"
                placeholder="Tipo"
                value={formState.type}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputLabel}>
              <label>Data de início*</label>
              <input
                type="text"
                name="dateStart"
                placeholder="Data de Início (dd/mm/yyyy)"
                value={formState.dateStart}
                onChange={(e) => handleMaskedChange(e, maskDate)}
                required
              />
            </div>
            <div className={styles.inputLabel}>
              <label>Hora de início*</label>
              <input
                type="text"
                name="hourStart"
                placeholder="Hora de Início (hh:mm)"
                value={formState.hourStart}
                onChange={(e) => handleMaskedChange(e, maskTime)}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputLabel}>
              <label>Data de término*</label>
              <input
                type="text"
                name="dateEnd"
                placeholder="Data de Término (dd/mm/yyyy)"
                value={formState.dateEnd}
                onChange={(e) => handleMaskedChange(e, maskDate)}
                required
              />
            </div>
            <div className={styles.inputLabel}>
              <label>Hora de término*</label>
              <input
                type="text"
                name="hourEnd"
                placeholder="Hora de Término (hh:mm)"
                value={formState.hourEnd}
                onChange={(e) => handleMaskedChange(e, maskTime)}
                required
              />
            </div>
          </div>
          <div className={styles.place}>
            <label>Lugar*</label>
            <select
              name="placeId"
              value={formState.placeId}
              onChange={handleChange}
              required
            >
              <option value={0}>Selecione um local</option>
              {placesList.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </select>
            <div className={styles.link}>
              <Link to="/edit-place/new">Cadastrar local</Link>
            </div>
          </div>

          <div className={styles.customLine}></div>

          <div className={styles.formGroup}>
            <div className={styles.inputLabel}>
              <label>Email*</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputLabel}>
              <label>Celular*</label>
              <input
                type="text"
                name="phone"
                placeholder="Celular"
                value={formState.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.customLine}></div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button className={styles.cancelar} type="submit">
              {formState.id ? "Salvar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
