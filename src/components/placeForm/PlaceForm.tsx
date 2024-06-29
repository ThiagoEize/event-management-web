import React, { useState, useEffect } from "react";
import { usePlaceContext } from "../../context/PlaceContext";
import { useParams, useNavigate } from "react-router-dom";
import useConfirm from "../../hooks/useConfirm";
import ContentTop from "../contentTop/ContentTop";
import styles from "./PlaceForm.module.css";

interface Gate {
  id?: string;
  placeId?: string;
  name: string;
}

interface Turnstile {
  id?: string;
  placeId?: string;
  name: string;
}

interface PlaceFormState {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  gates: Gate[];
  turnstiles: Turnstile[];
}

const PlaceForm: React.FC = () => {
  const { placesList, addPlace, updatePlace } = usePlaceContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<PlaceFormState>({
    id: "",
    name: "",
    address: "",
    city: "",
    state: "",
    gates: [],
    turnstiles: [],
  });
  const [newGateName, setNewGateName] = useState("");
  const [newTurnstileName, setNewTurnstileName] = useState("");
  const confirm = useConfirm();

  useEffect(() => {
    if (id) {
      const place = placesList.find((place) => place.id.toString() === id);
      if (place) {
        setFormState({
          id: place.id,
          name: place.name,
          address: place.address,
          city: place.city,
          state: place.state,
          gates: place.gates,
          turnstiles: place.turnstiles,
        });
      }
    }
  }, [id, placesList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleGateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGateName(e.target.value);
  };

  const handleTurnstileNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTurnstileName(e.target.value);
  };

  const addGate = () => {
    if (newGateName.trim()) {
      const newGate: Gate = { name: newGateName.trim() };
      setFormState((prev) => ({ ...prev, gates: [...prev.gates, newGate] }));
      setNewGateName("");
    }
  };

  const addTurnstile = () => {
    if (newTurnstileName.trim()) {
      const newTurnstile: Turnstile = { name: newTurnstileName.trim() };
      setFormState((prev) => ({
        ...prev,
        turnstiles: [...prev.turnstiles, newTurnstile],
      }));
      setNewTurnstileName("");
    }
  };

  const removeGate = async (gateName?: string) => {
    const isConfirmed = await confirm("portão", String(gateName));
    if (isConfirmed) {
      setFormState((prev) => ({
        ...prev,
        gates: prev.gates.filter((gate) => gate.name !== gateName),
      }));
    }
  };

  const removeTurnstile = async (turnstileName?: string) => {
    const isConfirmed = await confirm("catraca", String(turnstileName));
    if (isConfirmed) {
      setFormState((prev) => ({
        ...prev,
        turnstiles: prev.turnstiles.filter(
          (turnstile) => turnstile.name !== turnstileName
        ),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const placeData = {
      ...formState,
      gates: formState.gates.map((gate) => ({ id: gate.id, name: gate.name })),
      turnstiles: formState.turnstiles.map((turnstile) => ({
        id: turnstile.id,
        name: turnstile.name,
      })),
    };
    if (formState.id) {
      updatePlace(formState.id, placeData);
    } else {
      addPlace({ ...placeData, id: Date.now().toString() });
    }
  };

  return (
    <div className="formContainer">
      <ContentTop title="Editar Lugar" message="*Campos obrigatórios." />
      <div className="backgroundContainer">
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.inputLabel}>
              <label>Nome</label>
              <input
                type="text"
                name="name"
                placeholder="Nome"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputLabel}>
              <label>Endereço</label>
              <input
                type="text"
                name="address"
                placeholder="Endereço"
                value={formState.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputLabel}>
              <label>Cidade</label>
              <input
                type="text"
                name="city"
                placeholder="Cidade"
                value={formState.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputLabel}>
              <label>Estado</label>
              <input
                type="text"
                name="state"
                placeholder="Estado"
                value={formState.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputLabel}>
              <label>Portões</label>
              <div className={styles.inputWithButton}>
                <input
                  type="text"
                  placeholder="Adicionar portão"
                  value={newGateName}
                  onChange={handleGateNameChange}
                />
                <button
                  type="button"
                  onClick={addGate}
                  className={styles.addButton}
                >
                  +
                </button>
              </div>
              <div className={styles.itemsList}>
                {formState.gates.map((gate) => (
                  <div className={styles.itens} key={gate.id ?? gate.name}>
                    {gate.name}
                    <div onClick={() => removeGate(gate.name)}>X</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.inputLabel}>
              <label>Catracas</label>
              <div className={styles.inputWithButton}>
                <input
                  type="text"
                  placeholder="Adicionar catraca"
                  value={newTurnstileName}
                  onChange={handleTurnstileNameChange}
                />
                <button
                  type="button"
                  onClick={addTurnstile}
                  className={styles.addButton}
                >
                  +
                </button>
              </div>
              <div className={styles.itemsList}>
                {formState.turnstiles.map((turnstile) => (
                  <div
                    className={styles.itens}
                    key={turnstile.id ?? turnstile.name}
                  >
                    {turnstile.name}
                    <div onClick={() => removeTurnstile(turnstile.name)}>X</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.formActions}>
            <button
              className={styles.cancelar}
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button type="submit">
              {formState.id ? "Salvar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceForm;
