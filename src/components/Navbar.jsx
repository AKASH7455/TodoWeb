import { useState } from "react";

import {
  Menu,
  X,
  Search
} from "lucide-react";

import ThemeSwitcher
  from "./ThemeSwitcher";

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

      {/* TOP BAR */}

      <div className="navbar-top">

        <h1>
          React Todo App
        </h1>


        <div className="navbar-actions">

          {/* MOBILE SEARCH BUTTON */}

          <button
            className="icon-btn mobile-search-btn"
            onClick={toggleSearch}
          >

            <Search size={22} />

          </button>


          {/* MENU BUTTON */}

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


          {/* DESKTOP THEME */}

          <div className="desktop-theme">

            <ThemeSwitcher />

          </div>

        </div>

      </div>


      {/* MOBILE SEARCH BAR */}

      {
        showSearch && (

          <div className="navbar-search">

            <input
              type="text"
              placeholder="Search todos..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        )
      }


      {/* MOBILE MENU */}

  {
  menuOpen && (

    <>

      <div
        className="menu-overlay"
        onClick={() =>
          setMenuOpen(false)
        }
      ></div>

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