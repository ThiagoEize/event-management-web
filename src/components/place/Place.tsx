import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { usePlaceContext } from "../../context/PlaceContext";
import useConfirm from "../../hooks/useConfirm";
import styles from "./Place.module.css";
import useOutsideClick from "../../hooks/useOutsideClick";

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

interface PlaceProps {
  place: any;
  fieldsToDisplay: string[];
  style?: React.CSSProperties;
}

const Place: React.FC<PlaceProps> = ({ place, fieldsToDisplay, style }) => {
  const { deletePlace } = usePlaceContext();
  const [showOptions, setShowOptions] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const confirm = useConfirm();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-place/${place.id}`);
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm("lugar", String(place.name));
    if (isConfirmed) {
      deletePlace(place.id);
    }
  };

  const ref = useOutsideClick(() => {
    if (showOptions) setShowOptions(false);
  });

  const handleOptionsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY - 60,
      left: rect.left + window.scrollX - 96,
    });
    setShowOptions(!showOptions);
  };

  return (
    <>
      <tr className={styles.place} style={style}>
        {fieldsToDisplay.map((field) => {
          if (field === "name") {
            return <td key={field}>{place.name}</td>;
          }
          if (field === "address") {
            return <td key={field}>{place.address}</td>;
          }
          if (field === "city") {
            return <td key={field}>{place.city}</td>;
          }
          if (field === "state") {
            return <td key={field}>{place.state}</td>;
          }
          if (field === "gates") {
            return (
              <td key={field}>
                {place.gates.map((gate: Gate) => gate.name).join(", ")}
              </td>
            );
          }
          if (field === "turnstiles") {
            return (
              <td key={field}>
                {place.turnstiles
                  .map((turnstile: Turnstile) => turnstile.name)
                  .join(", ")}
              </td>
            );
          }
          if (field === "lastUpdate") {
            return <td key={field}>{place.lastUpdate}</td>;
          }
          return null;
        })}
        <td>
          <div
            onClick={handleOptionsClick}
            role="button"
            aria-label="options"
            // className={styles.optionsButton}
          >
            <FaEllipsisV />
          </div>
        </td>
      </tr>
      {showOptions && (
        <div
          ref={ref}
          className={styles.placeOptions}
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

export default Place;
