import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import CarouselComponent from "../../components/Carousel/Carousel";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ReasonContent from "../../components/ReasonContent"; // Using the new component
import PageLayout from "../../components/layouts/PageLayout";

export default function ReasonComp({ isNavbarHovered }) {
  const SUB = "La raison d'être"; // Assuming this is the appropriate sub-title
  const { isAuthenticated } = useAuth();

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        title={SUB}
        category="reason" // Assuming a new category for carousel
        carouselTextId={1} // Assuming this ID is correct
        isEditable={isAuthenticated}
      />
      <Breadcrumbs breadcrumbsnav="Qui sommes-nous ?" breadcrumbssub={SUB} />
      <PageLayout title={SUB} titleId="reason-title" DescriptionComponent={<ReasonContent />} />
    </>
  );
}