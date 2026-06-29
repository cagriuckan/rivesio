"use client";

import { createContext, useContext } from "react";

const UserContext = createContext<string>("admin");

export const UserProvider = UserContext.Provider;

export function useUser(): string {
  return useContext(UserContext);
}
