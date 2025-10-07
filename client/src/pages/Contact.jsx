import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

import Breadcrumbscontact from "../components/breadcrumbs/Breadcrumbscontact";
import FormContact from "../components/elements/FormContact";
import CarouselComponent from "../components/Carousel/Carousel";
import EditableParagraph from "../components/EditableParagraph";
import PageLayout from "../components/layouts/PageLayout";

export default function Contact({ isNavbarHovered }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const TITLE = "Nous contacter";
  const SUB = "Nous contacter";
  const { isAuthenticated } = useAuth();
  const SUBTEXT =
    "Genesia lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tationullamcorper suscipit lobortis nisl ut aliquip.";
  const [carouselSlides, setCarouselSlides] = useState([]);

  useEffect(() => {
    const fetchCarouselSlides = async () => {
      try {
        const response = await fetch(`${API_URL}/carouselImages`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // data is an object like { home: [...], food: [...], welcome: [...] }
        // Flatten all slides from all categories into a single array
        const allSlides = Object.values(data).flat();
        setCarouselSlides(
          allSlides.filter(
            (slide) => slide.alt === "welcome01" || slide.alt === "welcome02"
          )
        );
      } catch (error) {
        console.error("Error fetching carousel slides:", error);
      }
    };

    fetchCarouselSlides();
  }, []);

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="welcome"
        carouselTextId={11}
        isEditable={isAuthenticated}
        stationaryText={false}
        startFaded={true}
      />
      <Breadcrumbscontact breadcrumbsnav={TITLE} />
      <PageLayout
        title={TITLE}
        titleId="contact-us-title"
        DescriptionComponent={
          <>
            <EditableParagraph
              textId="contact-us-paragraph"
              defaultText="CONTACTLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."
            />
            <FormContact />
          </>
        }
      />
    </>
  );
}
