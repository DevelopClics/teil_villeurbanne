import Card from "react-bootstrap/Card";
import { Col, Button, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import "./TeamCard.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function TeamMemberCard({
  item,
  isEditable = false,
  onUpdate,
  onDelete,
  category,
}) {
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(item);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleEditClick = () => {
    setIsEditing(true);
    setSelectedFile(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(item); // Reset form data to original item data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveClick = async () => {
    let imageUrl = formData.src;

    if (selectedFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("image", selectedFile);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        imageUrl = result.url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    const updatedFormData = { ...formData, src: imageUrl };
    await onUpdate(category, item.id, updatedFormData);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete(category, item.id);
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      <Card>
        <div className="square-img-container">
          <img
            key={item.src} // Add this key
            className="square-img"
            src={`${item.src.startsWith("http") ? item.src : import.meta.env.BASE_URL + item.src}?v=${Date.now()}`}
            alt={item.alt}
            width="100%"
            height="100%"
          />
        </div>

        <Card.Body>
          {isEditable && isEditing ? (
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
                    onClick={handleEditClick}
                    className="me-2"
                  >
                    Modifier le profil
                  </Button>
                  {/* <Button variant="danger" onClick={handleDeleteClick}>
                    Delete
                  </Button> */}
                </>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}
