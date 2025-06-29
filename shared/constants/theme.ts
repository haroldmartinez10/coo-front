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
    fontFamily: "inherit",
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
    colorSchemeSelector: "class",
  },
  ...THEME_CONFIG,
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
