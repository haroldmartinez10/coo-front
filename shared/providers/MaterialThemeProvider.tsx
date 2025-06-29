"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";
import { THEME_COLORS, THEME_CONFIG } from "@/shared/constants/theme";

const theme = createTheme({
  palette: {
    mode: "light",
    ...THEME_COLORS,
  },
  ...THEME_CONFIG,
});

interface ProvidersProps {
  children: ReactNode;
}

export function MaterialThemeProvider({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
