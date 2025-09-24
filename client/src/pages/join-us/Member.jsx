import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import CarouselComponent from "../../components/Carousel/Carousel";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import FakeComp from "../../components/FakeComp";
import PageLayout from "../../components/layouts/PageLayout";

export default function Member({ isNavbarHovered }) {
  const SUB = "Devenir membre";
  const { isAuthenticated } = useAuth();
  const SUBTEXT =
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="member"
        carouselTextId={10}
        isEditable={isAuthenticated}
        stationaryText={true}
      />

      <Breadcrumbs breadcrumbsnav="Nous rejoindre" breadcrumbssub={SUB} />

      <PageLayout title={SUB} DescriptionComponent={<FakeComp />} />
    </>
  );
}