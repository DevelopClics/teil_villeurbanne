import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";
import EditableTitle from "../EditableTitle"; // Import EditableTitle

export default function PageLayout({ title, titleId, DescriptionComponent }) {
  return (
    <>
      <section className="reason-section" style={{ paddingTop: "50px" }}>
        <Container className="app-container-padding">
          <Row>
            <Col>
              {titleId ? (
                <EditableTitle textId={titleId} defaultTitle={title} />
              ) : (
                <h2>{title}</h2>
              )}

              {DescriptionComponent}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
