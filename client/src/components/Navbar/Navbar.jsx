import React, { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navigation = ({ onDropdownHoverChange, socialIconsTargetRef }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);

  const handleDropdownOpen = (dropdownId) => {
    setOpenDropdown(dropdownId);
    onDropdownHoverChange(true);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
    onDropdownHoverChange(false);
  };

  const handleDropdownToggle = (dropdownId) => {
    if (openDropdown === dropdownId) {
      setOpenDropdown(null);
      onDropdownHoverChange(false);
    } else {
      setOpenDropdown(dropdownId);
      onDropdownHoverChange(true);
    }
  };

  const handleItemClick = () => {
    setExpanded(false);
    setOpenDropdown(null);
    onDropdownHoverChange(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setExpanded(false);
        setOpenDropdown(null);
        onDropdownHoverChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isLinkActive = (paths) => {
    return paths.some((path) => {
      if (path.includes(":category")) {
        const regex = new RegExp(`^${path.replace(":category", "[^/]+")}`);
        return regex.test(location.pathname);
      }
      return location.pathname.startsWith(path);
    });
  };

  return (
    <Navbar
      ref={navbarRef}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      expand="md"
      className="navbar px-0"
    >
      <Container className="app-container-padding px-0">
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
              className={`nav-element nav-common-button nav-dropdown-button ${
                openDropdown === "qui-sommes-nous" ? "is-hovered" : ""
              } ${
                isLinkActive(["/genesis", "/team", "/places"]) ? "active-dropdown-parent" : ""
              }`}
            >
              <NavDropdown.Item as={Link} to="/genesis" onClick={handleItemClick}>
                La génèse
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/team" onClick={handleItemClick}>
                L'équipe
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/places" onClick={handleItemClick}>
                Les villes
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Les projets"
              id="nav-dropdown-les-projets"
              show={openDropdown === "les-projets"}
              onMouseEnter={() => handleDropdownOpen("les-projets")}
              onMouseLeave={handleDropdownClose}
              onClick={() => handleDropdownToggle("les-projets")}
              className={`nav-common-button nav-dropdown-button ${
                openDropdown === "les-projets" ? "is-hovered" : ""
              } ${
                isLinkActive(["/all-projects", "/projects/culture", "/projects/food", "/projects/youth", "/projects/economy", "/drop-project"]) ? "active-dropdown-parent" : ""
              }`}
            >
              <NavDropdown.Item as={Link} to="/all-projects" onClick={handleItemClick}>
                Tous les projets
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/projects/culture" onClick={handleItemClick}>
                Culture
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/projects/food" onClick={handleItemClick}>
                Alimentation
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/projects/youth" onClick={handleItemClick}>
                Jeunesse
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/projects/economy" onClick={handleItemClick}>
                Économie
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/drop-project" onClick={handleItemClick}>
                Déposer un projet
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/joinus-contact"
              className="nav-element nav-common-button nous-rejoindre-link"
              onClick={handleItemClick}
              style={{ verticalAlign: "middle" }}
            >
              Nous rejoindre
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;

