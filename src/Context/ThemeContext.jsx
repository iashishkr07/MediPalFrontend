import { createContext, useContext, useEffect } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
} from "@mui/material";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const isDarkMode = true; // Always dark mode

  useEffect(() => {
    // Always apply dark class for Tailwind
    document.documentElement.classList.add("dark");
  }, []);

  const mode = "dark";
  const muiTheme = createTheme({
    palette: { mode },
    // You can add more customizations here
  });

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleDarkMode: () => {}, mode, muiTheme }}
    >
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useMuiTheme = () => {
  const { muiTheme } = useTheme();
  return muiTheme;
};
