"use client"

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import MobileMenu from "./MobileMenu";
import DarkModeToggle from "./DarkModeToggle";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">MyBrand</div>

        {/* Desktop Menu */}
        <ul className="nav-links">
          {["Home", "Services", "About", "Contact"].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </li>
          ))}
        </ul>

        {/* Right Section: Dark Mode + Mobile Menu */}
        <div className="nav-icons">
          <DarkModeToggle />
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Shown Only on Small Screens) */}
      {isOpen && <MobileMenu />}
    </nav>
  );
};

export default Navbar;
