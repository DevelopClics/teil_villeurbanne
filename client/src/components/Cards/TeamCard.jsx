import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Row, Col, Button, Form } from "react-bootstrap"; // Added Form
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import "./TeamCard.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function TeamCard({
  items = [],
  isEditable = false,
  onUpdate,
  onDelete,
  category,
}) {
  const { isAuthenticated } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setSelectedFile(null); // Clear selected file when starting edit
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setFormData({});
    setSelectedFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveClick = async () => {
    let imageUrl = formData.src; // Default to existing image URL

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3001/upload/${category}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        imageUrl = result.url; // Get the URL of the uploaded image
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle error, maybe don't save if upload fails
        return;
      }
    }

    const updatedFormData = { ...formData, src: imageUrl };
    console.log("imageUrl before onUpdate:", imageUrl);
    console.log("updatedFormData before onUpdate:", updatedFormData);
    await onUpdate(category, formData.id, updatedFormData);
    setEditingId(null);
    setSelectedFile(null);
  };

  const handleDeleteClick = (id) => {
    onDelete(category, id);
  };

  return (
    <Row className="g-2 g-sm-2 g-lg-4">
      {items.map((item, index) => (
        <Col key={item.id || index} xs={12} sm={6} md={4} lg={3}>
          <Card>
            <div className="square-img-container">
              <LazyLoadImage
                wrapperClassName="square-img"
                src={ `${item.src.startsWith("http") ? item.src : import.meta.env.BASE_URL + item.src}?v=${Date.now()}` }
                alt={item.alt}
                effect="blur"
                width="100%"
                height="100%"
              />
            </div>

            <Card.Body>
              {isEditable && editingId === item.id ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      name="surname"
                      value={formData.surname || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom de famille</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastname"
                      value={formData.lastname || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Emploi</Form.Label>
                    <Form.Control
                      type="text"
                      name="occupation"
                      value={formData.occupation || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      value={formData.contact || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Texte de substitution (alt)</Form.Label>
                    <Form.Control
                      type="text"
                      name="alt"
                      value={formData.alt || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    onClick={handleSaveClick}
                    className="me-2"
                  >
                    Sauvegarder
                  </Button>
                  <Button variant="secondary" onClick={handleCancelClick}>
                    Annuler
                  </Button>
                </Form>
              ) : (
                <>
                  <Card.Title>
                    {item.surname} {item.lastname}
                  </Card.Title>
                  <Card.Text>
                    <span style={{ fontSize: "0.75em" }}>
                      {item.occupation}
                    </span>
                    <br />
                    <span style={{ fontSize: "0.75em" }}>{item.contact}</span>
                  </Card.Text>
                  {isEditable && isAuthenticated && (
                    <>
                      <Button
                        variant="warning"
                        onClick={() => handleEditClick(item)}
                        className="me-2"
                      >
                        Modifier le profil
                      </Button>
                      {/* <Button variant="danger" onClick={() => handleDeleteClick(item.id)}>
                        Delete
                      </Button> */}
                    </>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
