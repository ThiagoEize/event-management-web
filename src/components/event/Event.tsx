import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { useEventContext } from "../../context/EventContext";
import styles from "./Event.module.css";
import useOutsideClick from "../../hooks/useOutsideClick";
import useConfirm from "../../hooks/useConfirm";
import axios from "axios";

interface EventProps {
  event: any;
  fieldsToDisplay: string[];
  style?: React.CSSProperties;
}

interface Gate {
  id: string;
  placeId: string;
  name: string;
}

interface Turnstile {
  id: string;
  placeId: string;
  name: string;
}

const Event: React.FC<EventProps> = ({ event, fieldsToDisplay, style }) => {
  const { deleteEvent } = useEventContext();
  const [showOptions, setShowOptions] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [placeName, setPlaceName] = useState<string>("");
  const [gates, setGates] = useState<Gate[]>([]);
  const [turnstiles, setTurnstiles] = useState<Turnstile[]>([]);

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        if (
          fieldsToDisplay.includes("gates") ||
          fieldsToDisplay.includes("turnstiles")
        ) {
          const placeResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/places/${event.placeId}`
          );
          setPlaceName(placeResponse.data.name);
          if (fieldsToDisplay.includes("gates")) {
            setGates(placeResponse.data.gates);
          }
          if (fieldsToDisplay.includes("turnstiles")) {
            setTurnstiles(placeResponse.data.turnstiles);
          }
        }
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    };

    if (event.placeId) {
      fetchPlaceData();
    }
  }, [event.placeId, fieldsToDisplay]);

  const handleEdit = () => {
    navigate(`/edit-event/${event.id}`);
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm("evento", String(event.event));
    if (isConfirmed) {
      deleteEvent(event.id);
    }
  };

  const ref = useOutsideClick(() => {
    if (showOptions) setShowOptions(false);
  });

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY - 60,
      left: rect.left + window.scrollX - 96,
    });
    setShowOptions(!showOptions);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <tr className={styles.event} style={style}>
        {fieldsToDisplay.map((field) => {
          if (field === "placeId" && placeName) {
            return <td key={field}>{placeName}</td>;
          }
          if (field === "event") {
            return <td key={field}>{event.event}</td>;
          }
          if (field === "type") {
            return <td key={field}>{event.type}</td>;
          }
          if (field === "email") {
            return <td key={field}>{event.email}</td>;
          }
          if (field === "phone") {
            return <td key={field}>{event.phone}</td>;
          }
          if (field === "dateStart") {
            return (
              <td key={field}>
                {formatDate(event.dateStart)} {formatTime(event.dateStart)}
              </td>
            );
          }
          if (field === "dateEnd") {
            return (
              <td key={field}>
                {formatDate(event.dateEnd)} {formatTime(event.dateEnd)}
              </td>
            );
          }
          if (field === "gates") {
            return (
              <td key={field}>{gates.map((gate) => gate.name).join(", ")}</td>
            );
          }
          if (field === "turnstiles") {
            return (
              <td key={field}>
                {turnstiles.map((turnstile) => turnstile.name).join(", ")}
              </td>
            );
          }
          return null;
        })}
        <td>
          <div
            onClick={handleOptionsClick}
            // className={styles.optionsButton}
            role="button"
            aria-label="options"
          >
            <FaEllipsisV />
          </div>
        </td>
      </tr>
      {showOptions && (
        <div
          ref={ref}
          className={styles.eventOptions}
          style={{
            position: "absolute",
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          <div onClick={handleEdit}>Edit</div>
          <div onClick={handleDelete}>Delete</div>
        </div>
      )}
    </>
  );
};

export default Event;
