import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import CarouselComponent from "../../components/Carousel/Carousel";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import FakeComp from "../../components/FakeComp";
import PageLayout from "../../components/layouts/PageLayout";

export default function Volunteer({ isNavbarHovered }) {
  const SUB = "Bénèvolat";
  const { isAuthenticated } = useAuth();
  const SUBTEXT =
    "Benevole lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tationullamcorper suscipit lobortis nisl ut aliquip.";

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        title={SUB}
        text={SUBTEXT}
        category="volunteer"
        carouselTextId={10}
        isEditable={isAuthenticated}
      />

      <Breadcrumbs breadcrumbsnav="Nous rejoindre" breadcrumbssub={SUB} />

      <PageLayout title={SUB} DescriptionComponent={<FakeComp />} />
    </>
  );
}