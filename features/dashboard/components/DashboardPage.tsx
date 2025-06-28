"use client";
import React from "react";
import Button from "@mui/material/Button";
import { signOut } from "next-auth/react";

const DashboardPage = () => {
  const handleSignOut = async () => {
    signOut();
  };

  return (
    <Button variant="contained" color="primary" onClick={handleSignOut}>
      Log Out
    </Button>
  );
};

export default DashboardPage;
