"use client";

import { useEffect } from "react";
import { Session } from "next-auth";

interface IAuthProviderProps {
  session: Session | null;
  children: React.ReactNode;
}

export const AuthProvider = ({ session, children }: IAuthProviderProps) => {
  return children;
};
