import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Breadcrumbs.css";
export default function Breadcrumbs({ breadcrumbsnav, breadcrumbssub }) {
  return (
    <h2 className="blue-bar">
      <span>
        {breadcrumbsnav} {">>>"}
      </span>{" "}
      <span style={{ color: "var(--secondary-color)", marginLeft: "1rem" }}>
        {breadcrumbssub}
      </span>
    </h2>
  );
}
