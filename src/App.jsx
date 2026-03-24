import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import MainApp from "./pages/MainApp";

function App() {
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container justify-center">
      <div className="bg-background w-screen p-6">
        <MainApp />
      </div>
    </main>
  );
}

export default App;
