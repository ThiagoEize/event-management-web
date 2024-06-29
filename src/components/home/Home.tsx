import React, { useEffect } from "react";
import EventsList from "../eventsList/EventsList";
import PlacesList from "../placesList/PlacesList";
import { usePlaceContext } from "../../context/PlaceContext";
import { useEventContext } from "../../context/EventContext";
import { useNavigate, Link } from "react-router-dom";
import "../../index.css";
import styles from "./Home.module.css";
import placeIcon from "../../assets/images/placeIcon.png";
import eventIcon from "../../assets/images/eventIcon.png";
import toy from "../../assets/images/toy.png";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const placesToDisplay = [
    { key: "name", name: "Nome do lugar" },
    { key: "address", name: "Endereço" },
    { key: "turnstiles", name: "Catracas" },
  ];
  const eventFieldsToDisplay = [
    { key: "placeId", name: "Nome do lugar" },
    { key: "event", name: "Evento" },
    { key: "type", name: "Tipo" },
    { key: "gates", name: "Portões cadastrados" },
  ];

  const { fetchPlaces } = usePlaceContext();
  const { fetchEvents } = useEventContext();

  useEffect(() => {
    fetchPlaces({ page: 1, limit: 3, searchTerm: "", orderBy: "updatedAt" });
    fetchEvents({ page: 1, limit: 3, searchTerm: "", orderBy: "createdAt" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // <div className="container">
    <div className="mainContainer">
      <div className="customRow">
        <img className={styles.toy} src={toy} alt="Lugares" />
        <div className="col-4 row">
          <h1>Olá, Thiago</h1>
          <p>Confira todos os seus eventos e locais em um só lugar!</p>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-6">
          <div className={styles.allPlacesContainer}>
            <div className="left-align">
              <div>
                <div className="customRow">
                  <img
                    className={styles.placeIcon}
                    src={placeIcon}
                    alt="Lugares"
                  />
                  <div>
                    <h1>Locais</h1>
                  </div>
                </div>
                <p>Confira todo os locais cadastrados!</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/places")}
              className={styles.button}
            >
              Conferir locais
            </button>
          </div>
          <div className="backgroundContainer">
            <div className="customRowSpace">
              <h3>Ultimos lugares adicionados</h3>
              <Link to="/places" className="ml-auto">
                Ver todos
              </Link>
            </div>
            <PlacesList
              fieldsToDisplay={placesToDisplay}
              showTitles={false}
              showPagination={false}
            />
          </div>
        </div>
        <div className="col-6">
          <div className={styles.allEventsContainer}>
            <div className="left-align">
              <div>
                <div className="customRow">
                  <img
                    className={styles.eventIcon}
                    src={eventIcon}
                    alt="Eventos"
                  />
                  <div>
                    <h1>Eventos</h1>
                  </div>
                </div>
                <p>Confira todo os eventos cadastrados!</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/events")}
              className={styles.button}
            >
              Conferir eventos
            </button>
          </div>
          <div className="backgroundContainer">
            <div className="customRowSpace">
              <h3>Ultimos eventos adicionados</h3>
              <Link to="/events" className="ml-auto">
                Ver todos
              </Link>
            </div>
            <EventsList
              fieldsToDisplay={eventFieldsToDisplay}
              showTitles={false}
              showPagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
