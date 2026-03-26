import { create } from "zustand";

export const useProfile = create((set) => ({
    profile: [],
    setProfile: (data) => set({profile: data})
}))