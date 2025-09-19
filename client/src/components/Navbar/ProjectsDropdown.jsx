import React from "react";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProjectsDropdown = ({
  openDropdown,
  handleDropdownToggle,
  handleDropdownOpen,
  handleDropdownClose,
  handleItemClick,
  location,
}) => {
  return (
    <NavDropdown
      title="Tous les projets"
      id="nav-dropdown-les-projets"
      show={openDropdown === "les-projets"}
      onMouseEnter={() => handleDropdownOpen("les-projets")}
      onMouseLeave={handleDropdownClose}
      onClick={() => handleDropdownToggle("les-projets")}
      className={`nav-element ${
        openDropdown === "les-projets" ? "is-hovered" : ""
      } ${
        location.pathname === "/all-projects" ||
        location.pathname === "/culture" ||
        location.pathname === "/food" ||
        location.pathname === "/youth" ||
        location.pathname === "/economy"
          ? "active-dropdown-parent"
          : ""
      }`}
    >
      <NavDropdown.Item as={Link} to="/all-projects" onClick={handleItemClick}>
        Tous les projets
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/cooperation" onClick={handleItemClick}>
        Coopération
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/culture" onClick={handleItemClick}>
        Culture
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/food" onClick={handleItemClick}>
        Alimentation
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/youth" onClick={handleItemClick}>
        Jeunesse
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/economy" onClick={handleItemClick}>
        Économie
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/contact" onClick={handleItemClick}>
        Déposer un projet
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default ProjectsDropdown;
