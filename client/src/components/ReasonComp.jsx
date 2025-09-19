import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import CarouselComponent from "../components/Carousel/Carousel";
import Breadcrumbs from "../components/breadcrumbs/Breadcrumbs";
import ReasonContent from "../components/ReasonContent"; // Using the new component
import PageLayout from "../components/layouts/PageLayout";

export default function ReasonComp({ isNavbarHovered }) {
  const SUB = "La raison d'être"; // Assuming this is the appropriate sub-title
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ReasonContent />
    </>
  );
}
