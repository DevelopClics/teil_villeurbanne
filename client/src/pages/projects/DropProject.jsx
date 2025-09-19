import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import CarouselComponent from "../../components/Carousel/Carousel";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import GenesisComp from "../../components/GenesisComp";
import PageLayout from "../../components/layouts/PageLayout";
import FakeComp from "../../components/FakeComp";
import EditableTitle from "../../components/EditableTitle";

export default function DropProject({ isNavbarHovered }) {
  const SUB = "Déposer un projet";
  const { isAuthenticated } = useAuth();

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        title={SUB}
        category="projects"
        carouselTextId={9}
        isEditable={isAuthenticated}
      />
      <Breadcrumbs breadcrumbsnav="Qui sommes-nous ?" breadcrumbssub={SUB} />
      <section className="reason-section" style={{ paddingTop: "50px" }}>
        <Container className="app-container-padding">
          <Row>
            <Col>
              <EditableTitle textId="drop-project-title" defaultTitle={SUB} />
              <PageLayout DescriptionComponent={<FakeComp />} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
