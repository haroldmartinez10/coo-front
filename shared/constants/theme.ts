export const THEME_COLORS = {
  primary: {
    main: "#1063AC",
  },
  secondary: {
    main: "#1063AC",
  },
} as const;

export const THEME_CONFIG = {
  typography: {
    fontFamily: "var(--font-roboto), Roboto, Arial, sans-serif",
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      },
    },
  },
} as const;

export const TOOLPAD_THEME_CONFIG = {
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  ...THEME_CONFIG,
  typography: {
    fontFamily: "var(--font-roboto), Roboto, Arial, sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
} as const;
