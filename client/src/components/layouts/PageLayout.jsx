import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";
import EditableTitle from "../EditableTitle"; // Import EditableTitle

export default function PageLayout({ title, titleId, DescriptionComponent }) {
  return (
    <>
      <section className="reason-section">
        {titleId ? (
          <EditableTitle textId={titleId} defaultTitle={title} />
        ) : (
          <h2>{title}</h2>
        )}

        {DescriptionComponent}
      </section>
    </>
  );
}
