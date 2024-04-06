import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewEvent from "./pages/NewEvent";

function App() {
  return (
    <div className="App">
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-event" element={<NewEvent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
