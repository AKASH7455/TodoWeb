import { useState } from "react";

import {
  Menu,
  X,
  Search
} from "lucide-react";

import ThemeSwitcher from "./ThemeSwitcher";

import "../styles/navbar.css";

function Navbar({
  search,
  setSearch
}) {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [showSearch, setShowSearch] =
    useState(false);

  function toggleMenu() {

    setMenuOpen(!menuOpen);

    if (showSearch) {
      setShowSearch(false);
    }
  }

  function toggleSearch() {

    setShowSearch(!showSearch);

    if (menuOpen) {
      setMenuOpen(false);
    }
  }

  return (

    <nav className="navbar">

      <div className="navbar-top">

        <h1>
          React Todo App
        </h1>

        <div className="navbar-actions">

          <button
            className="icon-btn mobile-search-btn"
            onClick={toggleSearch}
          >
            <Search size={22} />
          </button>

          <button
            className="icon-btn mobile-menu-btn"
            onClick={toggleMenu}
          >
            {
              menuOpen
                ? <X size={24} />
                : <Menu size={24} />
            }
          </button>

          <div className="desktop-theme">
            <ThemeSwitcher />
          </div>

        </div>

      </div>

      {
        showSearch && (

          <div className="navbar-search">

            <input
              type="text"
              placeholder="Search todos..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        )
      }

      {
        menuOpen && (

          <>

            <div
              className="menu-overlay"
              onClick={() =>
                setMenuOpen(false)
              }
            />

            <div className="mobile-menu">

              <ThemeSwitcher />

            </div>

          </>

        )
      }

    </nav>
  );
}

export default Navbar;