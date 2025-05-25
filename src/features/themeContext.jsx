import { createContext, useContext, useEffect, useState } from "react";
import { getFromLocal, saveToLocal } from "../helpers/functions";
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  setFetchMethod,
} from "darkreader";

// Create a context for theme management
const themeContext = createContext("");

function ThemeProvider({ children }) {
  // State to manage the current theme ("light" or "dark")
  const [theme, setTheme] = useState(
    getFromLocal("theme") === "dark" ? "dark" : "light"
  );

  // Effect to apply the theme whenever it changes
  useEffect(
    function () {
      if (theme === "light") {
        disableDarkMode(); // Disable dark mode for light theme
      } else {
        setFetchMethod(window.fetch); // Set fetch method for Darkreader
        enableDarkMode({
          brightness: 100,
          contrast: 100,
          sepia: -50,
        }); // Enable dark mode for dark theme
      }

      saveToLocal("theme", theme); // Save the current theme to local storage
    },
    [theme] // Run effect when theme changes
  );

  // Provide the theme and setter to child components
  return (
    <themeContext.Provider value={[theme, setTheme]}>
      {children}
    </themeContext.Provider>
  );
}

function useTheme() {
  // Custom hook to consume the theme context
  const context = useContext(themeContext);
  if (!context) return null; // Return null if context is unavailable
  return context; // Return the theme and setter function
}

export { ThemeProvider, useTheme };
