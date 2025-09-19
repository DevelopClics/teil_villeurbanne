import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Breadcrumbs.css";
export default function Breadcrumbscontact({ breadcrumbsnav }) {
  return <h2 className="blue-bar">{breadcrumbsnav}</h2>;
}
