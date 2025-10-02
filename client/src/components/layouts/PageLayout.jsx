import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";
import EditableTitle from "../EditableTitle"; // Import EditableTitle

export default function PageLayout({ title, titleId, DescriptionComponent }) {
  return (
    <>
      <section className="reason-section">
        <Container fluid className="pt-5">
          <Row className="justify-content-md-center">
            <Col xl={10} className="px-4 px-md-5 px-xl-0">
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
