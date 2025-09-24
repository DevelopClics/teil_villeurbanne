import React, { useState, useEffect } from "react";
import { Card, Col, Button, Form } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

import "./TeamCard.css";

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
    setFormData(item);
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
        const response = await fetch(`http://localhost:3001/upload/${category}`, {
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

    const updatedFormData = {
      ...formData,
      src: imageUrl,
      cacheBust: Date.now(), // Update cacheBust to bust cache
    };
    console.log("TeamMemberCardcop: updatedFormData before onUpdate", updatedFormData);

    await onUpdate(category, item.id, updatedFormData);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete(category, item.id);
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      {/* Put key here to force remount on cacheBust change */}
      <Card key={`${item.id}-${item.cacheBust || 0}`}>
        <div
          className="square-img-container"
          key={`${item.id}-${item.cacheBust || 0}`}
        >
          <img
            className="square-img"
            src={`${
              item.src.startsWith("http")
                ? item.src
                : import.meta.env.BASE_URL + item.src
            }?v=${item.cacheBust || 0}`}
            alt={item.alt || "Team member"}
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
                <span style={{ fontSize: "0.75em" }}>{item.occupation}</span>
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
                  {/* Delete button here if needed */}
                </>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}