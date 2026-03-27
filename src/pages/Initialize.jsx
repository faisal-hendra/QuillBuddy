import React, { useEffect, useState } from "react";
import { useStoredApiKeys, useOsName } from "@/store/profile";
import Database from "@tauri-apps/plugin-sql";
import Workspace from "./Workspace";
import WelcomeScreen from "./Welcome";
import { invoke } from "@tauri-apps/api/core";

function Initialize() {
  const storedApiKeys = useStoredApiKeys((state) => state.storedApiKeys);
  const setStoredApiKeys = useStoredApiKeys((state) => state.setStoredApiKeys);
  const setOsName = useOsName((state) => state.setOsName);

  const [isLoaded, setIsLoaded] = useState(false);

  // Get OS Name
  const fetchOsName = async () => {
    const os = await invoke("get_os_name");
    setOsName(os);
    console.log("os name : ", os);
  };

  const fetchApiProviders = async () => {
    try {
      const db = await Database.load("sqlite:profile.db");
      const apiProviders = await db.select("SELECT * FROM profile");
      setStoredApiKeys(apiProviders);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchOsName();
    fetchApiProviders();
  }, []);

  if (!isLoaded) {
    return <div></div>;
  }

  if (storedApiKeys.length > 0) {
    return <Workspace />;
  } else {
    return <WelcomeScreen />;
  }
}

export default Initialize;
