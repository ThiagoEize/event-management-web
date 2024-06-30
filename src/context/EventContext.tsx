import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useHelperContext } from "../context/HelperContext";

interface Event {
  id: string;
  placeId: number;
  event: string;
  email: string;
  phone: string;
  type: string;
  dateStart: string;
  dateEnd: string;
}

interface SearchArguments {
  page: number;
  limit: number;
  searchTerm: string;
  orderBy: string;
}

interface EventContextType {
  eventsList: Event[];
  totalEvents: number;
  currentPage: number;
  fetchEvents: (args: SearchArguments) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updatedEvent: Event) => void;
  deleteEvent: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showResponse } = useHelperContext();
  const navigate = useNavigate();

  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEvents = async ({
    page,
    limit,
    searchTerm,
    orderBy,
  }: SearchArguments) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/events?page=${page}&limit=${limit}&order=${orderBy}&search=${searchTerm}`
      );
      setEventsList(response.data.data);
      setTotalEvents(response.data.total);
      setCurrentPage(page);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      // showResponse("Error", String(error.response.data.message));
    }
  };

  const addEvent = async (event: Event) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/events`, event);
      setEventsList((prevEvents) => [event, ...prevEvents]);
      setTotalEvents((prevTotal) => prevTotal + 1);
      navigate(-1);
      showResponse("Sucesso", "Evento adicionado com sucesso");
    } catch (error: any) {
      console.error("Error adding event:", error);
      showResponse("Erro", String(error.response.data.message));
    }
  };

  const updateEvent = async (id: string, updatedEvent: Event) => {
    try {
      const newUdatedEvent = {
        ...updatedEvent,
        placeId: Number(updatedEvent.placeId),
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/events/${id}`,
        newUdatedEvent
      );
      setEventsList((prevEvents) =>
        prevEvents.map((event) => (event.id === id ? response.data : event))
      );
      navigate(-1);
      showResponse("Sucesso", "Evento modificado com sucesso");
    } catch (error: any) {
      console.error("Error updating event:", error);
      showResponse("Erro", String(error.response.data.message));
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/events/${id}`);
      setEventsList((prevEvents) =>
        prevEvents.filter((event) => event.id !== id)
      );
      setTotalEvents((prevTotal) => prevTotal - 1);
      showResponse("Sucesso", "Evento deletado com sucesso");
    } catch (error: any) {
      console.error("Error deleting event:", error);
      showResponse("Erro", String(error.response.data.message));
    }
  };

  return (
    <EventContext.Provider
      value={{
        eventsList,
        totalEvents,
        currentPage,
        fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};

export { EventProvider, useEventContext };
