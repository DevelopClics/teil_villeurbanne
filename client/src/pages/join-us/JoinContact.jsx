import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";

import Breadcrumbscontact from "../../components/breadcrumbs/Breadcrumbscontact";
import FormJoinus from "../../components/elements/FormJoinus";
import CarouselComponent from "../../components/Carousel/Carousel";
import EditableTitle from "../../components/EditableTitle";

export default function JoinContact({ isNavbarHovered }) {
  const TITLE = "Nous rejoindre";
  const SUB = "Nous rejoindre";
  const { isAuthenticated } = useAuth();
  const SUBTEXT =
    "Genesia lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tationullamcorper suscipit lobortis nisl ut aliquip.";

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        title={SUB}
        text={SUBTEXT}
        category="welcome"
        carouselTextId={10}
        isEditable={isAuthenticated}
      />
      <Breadcrumbscontact breadcrumbsnav={TITLE} />
      <section className="reason-section" style={{ paddingTop: "50px" }}>
        <Container className="app-container-padding">
          <Row>
            <Col>
              <EditableTitle textId="join-us-title" defaultTitle={SUB} />
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetuer
                adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                laoreet dolore magna aliquam erat volutpat.
              </p>
              <FormJoinus />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}