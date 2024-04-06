import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewEvent from "./pages/NewEvent";
import EventPage from "./pages/EventPage";

function App() {
  return (
    <div className="App">
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-event" element={<NewEvent />} />
          <Route path="/event" element={<EventPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
