import React, { useState, useRef, useEffect, useCallback } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProjectsDropdown from "./ProjectsDropdown";
import "./Navbar.css";

const Navigation = ({ onDropdownHoverChange, socialIconsTargetRef }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const navbarRef = useRef(null);
  const location = useLocation();

  const handleDropdownToggle = (dropdownId) => {
    if (openDropdown === dropdownId) {
      setOpenDropdown(null);
      onDropdownHoverChange(false);
    } else {
      setOpenDropdown(dropdownId);
      onDropdownHoverChange(true);
    }
  };

  const handleDropdownClose = useCallback(() => {
    setOpenDropdown(null);
    onDropdownHoverChange(false);
  }, [onDropdownHoverChange]);

  const handleDropdownOpen = (dropdownId) => {
    setOpenDropdown(dropdownId);
    onDropdownHoverChange(true);
  };

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear token from localStorage and update auth state
    navigate("/"); // Redirect to home page
    setExpanded(false); // Close navbar if open
    handleDropdownClose(); // Close any open dropdowns
  };

  const handleItemClick = () => {
    setExpanded(false);
    handleDropdownClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setExpanded(false);
        handleDropdownClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleDropdownClose]);

  return (
    <Navbar
      ref={navbarRef}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      expand="md"
      className="navbar px-0"
    >
      <Container className="app-container-padding px-0 navbar-container">
        <div className="mobile-nav-container">
          <div ref={socialIconsTargetRef} />
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="ms-auto me-5"
          />
        </div>
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          <Nav className="navbar-links">
            <NavDropdown
              title="Qui sommes-nous ?"
              id="nav-dropdown-qui-sommes-nous"
              show={openDropdown === "qui-sommes-nous"}
              onMouseEnter={() => handleDropdownOpen("qui-sommes-nous")}
              onMouseLeave={handleDropdownClose}
              onClick={() => handleDropdownToggle("qui-sommes-nous")}
              className={`nav-element ${
                openDropdown === "qui-sommes-nous" ? "is-hovered" : ""
              } ${
                location.pathname === "/genesis" ||
                location.pathname === "/team" ||
                location.pathname === "/places"
                  ? "active-dropdown-parent"
                  : ""
              }`}
            >
              <NavDropdown.Item
                as={Link}
                to="/genesis"
                onClick={handleItemClick}
              >
                La génèse
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/team" onClick={handleItemClick}>
                L'équipe
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/places"
                onClick={handleItemClick}
              >
                Les villes
              </NavDropdown.Item>
            </NavDropdown>

            <ProjectsDropdown
              openDropdown={openDropdown}
              handleDropdownToggle={handleDropdownToggle}
              handleDropdownOpen={handleDropdownOpen}
              handleDropdownClose={handleDropdownClose}
              handleItemClick={handleItemClick}
              location={location}
            />

            <NavDropdown
              title="Nous rejoindre"
              id="nav-dropdown-nous-rejoindre"
              show={openDropdown === "nous-rejoindre"}
              onMouseEnter={() => handleDropdownOpen("nous-rejoindre")}
              onMouseLeave={handleDropdownClose}
              onClick={() => handleDropdownToggle("nous-rejoindre")}
              className={`nav-element ${
                openDropdown === "nous-rejoindre" ? "is-hovered" : ""
              } ${
                location.pathname === "/member" ||
                location.pathname === "/donate" ||
                location.pathname === "/volunteer"
                  ? "active-dropdown-parent"
                  : ""
              }`}
            ></NavDropdown>
          </Nav>
          {/* {isAuthenticated && (
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleLogout}
              className="nav-element"
            >
              Déconnexion
            </Nav.Link>
          )} */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
