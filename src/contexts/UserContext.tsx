"use client";

import { createContext, useContext } from "react";

export interface UserContextValue {
  name: string;
  email: string;
  image: string | null;
}

const UserContext = createContext<UserContextValue>({ name: "admin", email: "", image: null });

export const UserProvider = UserContext.Provider;

export function useUser(): UserContextValue {
  return useContext(UserContext);
}
