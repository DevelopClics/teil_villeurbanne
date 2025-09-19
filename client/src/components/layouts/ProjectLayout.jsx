import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../../App.css";

export default function ProjectLayout({ item, isEditable = false, onUpdate, onBackClick, backButtonText }) {
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
    await onUpdate(item.id, formData, selectedFile);
    setIsEditing(false);
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-5 clearfix">
      {isEditable && isEditing ? (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Titre</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sous-titre</Form.Label>
            <Form.Control
              type="text"
              name="subtitle"
              value={formData.subtitle || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Article</Form.Label>
            <Form.Control
              as="textarea"
              name="article"
              value={formData.article || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contacts</Form.Label>
            <Form.Control
              type="text"
              name="contacts"
              value={formData.contacts || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lien 1 URL</Form.Label>
            <Form.Control
              type="text"
              name="links01"
              value={formData.links01 || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lien 1 Type</Form.Label>
            <Form.Control
              type="text"
              name="typelink01"
              value={formData.typelink01 || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lien 1 Nom</Form.Label>
            <Form.Control
              type="text"
              name="namelink01"
              value={formData.namelink01 || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lien 2 URL</Form.Label>
            <Form.Control
              type="text"
              name="links02"
              value={formData.links02 || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lien 2 Type</Form.Label>
            <Form.Control
              type="text"
              name="typelink02"
              value={formData.typelink02 || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lien 2 Nom</Form.Label>
            <Form.Control
              type="text"
              name="namelink02"
              value={formData.namelink02 || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Photographie</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Texte alternatif (au cas où l'imege ne s'affiche pas)
            </Form.Label>
            <Form.Control
              type="text"
              name="alt"
              value={formData.alt || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="success" onClick={handleSaveClick} className="me-2">
            Sauvegarder
          </Button>
          <Button variant="secondary" onClick={handleCancelClick}>
            Annuler
          </Button>
        </Form>
      ) : (
        <>
          <h4 style={{ color: 'var(--primary-color)' }}>{item.title}</h4>
          <hr />
          <div>
            <div
              className="mb-1 mb-xl-4 me-3 me-3 me-xl-5 me-xxl-5 col-sm-5 col-md-5 col-xl-4 col-xxl-5  img-fluid float-start"
              style={{ width: item.size + "%" }}
            >
              <LazyLoadImage
                src={`${
                  item.src.startsWith("http")
                    ? item.src
                    : import.meta.env.BASE_URL + item.src
                }?v=${item.cacheBust || 0}`}
                alt={item.alt}
                effect="blur"
                width="100%"
              />
            </div>

            <h5 className="text-uppercase">{item.subtitle}</h5>
            <p className="lh-1 no-padding-left">{item.article}</p>
            <p>
              <strong>
                <span>{item.contacts}</span>&nbsp;
                <span>{item.typelink01} </span>
                <a href={item.links01} target="_blank">
                  {item.namelink01}
                </a>
              </strong>
            </p>
            <p>
              <strong>
                <span>{item.typelink02} </span>
                <a href={item.links02} target="_blank">
                  {item.namelink02}
                </a>
              </strong>
            </p>
            {isEditable && onUpdate && (
              <div className="d-flex justify-content-end">
                <Button
                  variant="warning"
                  onClick={handleEditClick}
                  className="me-2"
                >
                  Modifier
                </Button>
              </div>
            )}
          </div> {/* End of main content block */}
          {onBackClick && backButtonText && (
            <Button className="btn-main-blue mt-3 text-start d-block" onClick={onBackClick}>
              {backButtonText}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
