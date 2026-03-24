import React from "react";
import ReactDOM from "react-dom/client";
import MainApp from "./pages/MainApp";
import WelcomeScreen from "./pages/WelcomeScreen";
import Configuration from "./pages/Configuration";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <div className="bg-background w-screen p-6">
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/config" element={<Configuration />} />
        </Routes>
      </div>
    </HashRouter>
  </React.StrictMode>,
);
