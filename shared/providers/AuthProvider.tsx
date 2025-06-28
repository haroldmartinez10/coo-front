"use client";

import { useEffect } from "react";
import { Session } from "next-auth";

import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { login, logout } from "@/shared/store/slices/auth/authSlice";

interface IAuthProviderProps {
  session: Session | null;
  children: React.ReactNode;
}

export const AuthProvider = ({ session, children }: IAuthProviderProps) => {
  console.log(session?.accessToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session && session.user) {
      dispatch(
        login({
          token: session?.accessToken,
          user: { email: session.user.email, name: session.user.name },
        })
      );
    } else {
      dispatch(logout());
    }
  }, [session, dispatch]);

  return <>{children}</>;
};
