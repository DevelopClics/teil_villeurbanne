import { Container, Row, Col } from "react-bootstrap";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CarouselComponent from "../../components/Carousel/Carousel";
import PageLayout from "../../components/layouts/PageLayout";
import GenesisComp from "../../components/GenesisComp";
import { useAuth } from "../../context/AuthContext";

export default function Genesis({ isNavbarHovered }) {
  const SUB = "La genèse";
  const { isAuthenticated } = useAuth();

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="genesis"
        carouselTextId={1}
        startFaded={true}
        isEditable={isAuthenticated}
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
