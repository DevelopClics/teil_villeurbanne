import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import CarouselComponent from "../../components/Carousel/Carousel";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import GenesisComp from "../../components/GenesisComp";
import PageLayout from "../../components/layouts/PageLayout";

export default function Genesis({ isNavbarHovered }) {
  const SUB = "La génèse";
  const { isAuthenticated } = useAuth();

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="genesis"
        carouselTextId={1}
        isEditable={isAuthenticated}
        stationaryText={true}
      />
      <Breadcrumbs breadcrumbsnav="Qui sommes-nous ?" breadcrumbssub={SUB} />
      <PageLayout
        title={SUB}
        titleId="genesis-title"
        DescriptionComponent={<GenesisComp />}
      />
    </>
  );
}
