import React from "react";
import { Route, Routes } from "react-router-dom";
import { PlaceProvider } from "./context/PlaceContext";
import { EventProvider } from "./context/EventContext";
import Home from "./components/home/Home";
import EventsCrud from "./components/eventsCrud/EventsCrud";
import PlaceForm from "./components/placeForm/PlaceForm";
import EventForm from "./components/eventForm/EventForm";
import PlacesCrud from "./components/placesCrud/PlacesCrud";
import { PlaceSearchProvider } from "./context/PlaceSearchContext";
import { EventSearchProvider } from "./context/EventSearchContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { HelperProvider } from "./context/HelperContext";
import NavBar from "./components/navBar/NavBar";

const App: React.FC = () => {
  return (
    <HelperProvider>
      <PlaceProvider>
        <EventProvider>
          <PlaceSearchProvider>
            <EventSearchProvider>
              <NavBar></NavBar>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/places" element={<PlacesCrud />} />
                <Route path="/events" element={<EventsCrud />} />
                <Route path="/edit-place/:id" element={<PlaceForm />} />
                <Route path="/edit-event/:id" element={<EventForm />} />
              </Routes>
            </EventSearchProvider>
          </PlaceSearchProvider>
        </EventProvider>
      </PlaceProvider>
    </HelperProvider>
  );
};

export default App;
