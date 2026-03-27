import React from "react";
import ReactDOM from "react-dom/client";
import Initialize from "./pages/Initialize";
import Workspace from "./pages/Workspace";
import Settings from "./pages/Settings";
import Welcome from "./pages/Welcome";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <div className="bg-background w-screen h-screen p-6 overflow-hidden select-none">
        <Routes>
          <Route path="/" element={<Initialize />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/Settings" element={<Settings />} />
        </Routes>
      </div>
    </HashRouter>
  </React.StrictMode>,
);
