import { Container, Row, Col } from "react-bootstrap";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CarouselComponent from "../../components/Carousel/Carousel";
import PageLayout from "../../components/layouts/PageLayout";
import GenesisComp from "../../components/GenesisComp";

export default function Genesis({ isNavbarHovered }) {
  const SUB = "La genèse";

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="genesis"
        carouselTextId={1}
        startFaded={true}
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
