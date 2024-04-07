import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import EventPage from "./pages/EventPage";
import PhotoView from "./pages/PhotoView";
import CreateEventPage from "./pages/CreateEventPage";
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className="App">
      <Router basename="/">
        <Analytics />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/event/:eventId" element={<EventPage />} />
          <Route path="/photo/:s3_url" element={<PhotoView/>} />
          <Route path="/createEvent" element={<CreateEventPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
