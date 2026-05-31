import {
  useState,
  useEffect
} from "react";

import ThemeContext
  from "./ThemeContextObject";


function ThemeProvider({ children }) {

  const [theme, setTheme] =
    useState(() => {

      return (
        localStorage.getItem("theme")
        || "light"
      );
    });


  useEffect(() => {

    document.body.className = theme;

    localStorage.setItem(
      "theme",
      theme
    );

  }, [theme]);


  return (

    <ThemeContext.Provider
      value={{
        theme,
        setTheme
      }}
    >

      {children}

    </ThemeContext.Provider>
  );
}


export default ThemeProvider;
