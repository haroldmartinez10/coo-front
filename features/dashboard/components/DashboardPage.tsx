"use client";
import React from "react";
import Button from "@mui/material/Button";
import { signOut } from "next-auth/react";
import { useAppSelector } from "@/shared/hooks/reduxHooks";

const DashboardPage = () => {
  const handleSignOut = async () => {
    signOut();
  };

  const state = useAppSelector((state) => state.auth);

  console.log(state);
  return (
    <Button variant="contained" color="primary" onClick={handleSignOut}>
      Log Out
    </Button>
  );
};

export default DashboardPage;
