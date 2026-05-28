
import {
  useContext
} from "react";

import {
  ThemeContext
} from "../context/ThemeContext";

import "../styles/themeswitcher.css";


function ThemeSwitcher() {

  const {
    theme,
    setTheme
  } = useContext(ThemeContext);


  return (

    <div className="theme-switcher">

      <button
        onClick={() => setTheme("light")}
        className={
          theme === "light"
            ? "active-theme"
            : ""
        }
      >
        Light
      </button>


      <button
        onClick={() => setTheme("dark")}
        className={
          theme === "dark"
            ? "active-theme"
            : ""
        }
      >
        Dark
      </button>


      <button
        onClick={() => setTheme("modern")}
        className={
          theme === "modern"
            ? "active-theme"
            : ""
        }
      >
        Modern
      </button>

    </div>
  );
}

export default ThemeSwitcher;