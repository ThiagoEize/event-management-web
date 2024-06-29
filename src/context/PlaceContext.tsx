import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useHelperContext } from "../context/HelperContext";

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

interface Place {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  gates: Gate[];
  turnstiles: Turnstile[];
}

interface SearchArguments {
  page: number;
  limit: number;
  searchTerm: string;
  orderBy: string;
}

interface PlaceContextType {
  placesList: Place[];
  totalPlaces: number;
  currentPage: number;
  fetchPlaces: (searchArgs: SearchArguments) => void;
  addPlace: (place: Place) => void;
  updatePlace: (id: string, updatedPlace: Place) => void;
  deletePlace: (id: string) => void;
}

const PlaceContext = createContext<PlaceContextType | undefined>(undefined);

const PlaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { showResponse } = useHelperContext(); // Use the HelperContext

  const [placesList, setPlacesList] = useState<Place[]>([]);
  const [totalPlaces, setTotalPlaces] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPlaces = useCallback(async (searchArgs: SearchArguments) => {
    try {
      console.log("Fetching places...");
      const { page, limit, searchTerm, orderBy } = searchArgs;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/places?page=${page}&limit=${limit}&order=${orderBy}&search=${searchTerm}`
      );
      setPlacesList(response.data.data);
      setTotalPlaces(response.data.total);
      setCurrentPage(page);
    } catch (error: any) {
      console.error("Error fetching places:", error);
    }
  }, []);

  const addPlace = async (place: Place) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/places`, place);
      setPlacesList((prevPlaces) => [place, ...prevPlaces]);
      setTotalPlaces((prevTotal) => prevTotal + 1);
      navigate(-1);
      showResponse("Sucesso", "Lugar adicionado com sucesso");
    } catch (error: any) {
      showResponse("Erro", String(error.response.data.message));
    }
  };

  const updatePlace = async (id: string, updatedPlace: Place) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/places/${id}`,
        updatedPlace
      );
      setPlacesList((prevPlaces) =>
        prevPlaces.map((place) => (place.id === id ? response.data : place))
      );
      navigate(-1);
      showResponse("Sucesso", "Place updated successfully");
    } catch (error: any) {
      console.error("Error updating place:", error);
      showResponse("Erro", String(error.response.data.message));
    }
  };

  const deletePlace = async (id: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/places/${id}`);
      setPlacesList((prevPlaces) =>
        prevPlaces.filter((place) => place.id !== id)
      );
      setTotalPlaces((prevTotal) => prevTotal - 1);
      showResponse("Sucesso", "Lugar adicionado com sucesso");
    } catch (error: any) {
      showResponse("Erro", String(error.response.data.message));
    }
  };

  return (
    <PlaceContext.Provider
      value={{
        placesList,
        totalPlaces,
        currentPage,
        fetchPlaces,
        addPlace,
        updatePlace,
        deletePlace,
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
};

const usePlaceContext = () => {
  const context = useContext(PlaceContext);
  if (!context) {
    throw new Error("usePlace must be used within a PlaceProvider");
  }
  return context;
};

export { PlaceProvider, usePlaceContext };
