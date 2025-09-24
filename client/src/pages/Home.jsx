import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../App.css";

import CarouselComponent from "../components/Carousel/Carousel";
import { useAuth } from "../context/AuthContext";

import Reason from "../components/ReasonComp";
import PageLayout from "../components/layouts/PageLayout";
import ReasonComp from "../components/ReasonComp";

export default function Home({ isNavbarHovered }) {
  const SUB = "notre raison d'être";
  const { isAuthenticated } = useAuth();

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        title={SUB}
        category="home"
        carouselTextId={0}
        isEditable={isAuthenticated}
        stationaryText={true}
        textPerSlide={true}
      />
      {/* <ReasonComp title="NOTRE RAISON D'ÊTRE" /> */}
      <PageLayout
        title={SUB}
        titleId="home-title"
        DescriptionComponent={<ReasonComp />}
      />
    </>
  );
}
