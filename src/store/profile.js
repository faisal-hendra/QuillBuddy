import { create } from "zustand";

export const useStoredApiKeys = create((set) => ({
  storedApiKeys: [],
  setStoredApiKeys: (data) => set({ storedApiKeys: data }),
}));

export const useOsName = create((set) => ({
  osName: "",
  setOsName: (name) => set({ osName: name }),
}));
