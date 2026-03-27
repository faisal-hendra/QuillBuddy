import React, { useEffect, useState } from "react";
import { useProfile } from "@/store/profile";
import Database from "@tauri-apps/plugin-sql";
import Workspace from "./Workspace";
import WelcomeScreen from "./WelcomeScreen";

function Initialize() {
  const profile = useProfile((state) => state.profile);
  const setProfile = useProfile((state) => state.setProfile);

  const [isLoaded, setIsLoaded] = useState(false);

  const getProfile = async () => {
    try {
      const db = await Database.load("sqlite:profile.db");
      const _profile = await db.select("SELECT * FROM profile");
      setProfile(_profile);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (profile.length > 0) {
    return <Workspace />;
  } else {
    return <WelcomeScreen />;
  }
}

export default Initialize;
