import React, { useState, useEffect } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../../App.css";

export default function ProjectLayout({
  item,
  isEditable = false,
  onUpdate,
  onBackClick,
  backButtonText,
}) {
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
          <h4>TITRES</h4>
          <Row>
            <Col md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Titre principal</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Sous-titre</strong> (date)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="subtitle"
                  value={formData.subtitle || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6} lg={4}>
              <Form.Group className="mb-5">
                <Form.Label>
                  <strong>Titre encadré</strong> (visible dans Tous les projets)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="panel"
                  value={formData.panel || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Titre raccourci</strong> (visible dans Tous les
                  projets)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="shortitle"
                  value={formData.shortitle || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Texte raccourci</strong> (visible dans Tous les
                  projets)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="shortext"
                  value={formData.shortext || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <h4>CONTACTS ET LIENS</h4>

            <Col md={6} lg={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Contacts</strong> Nom de l'organisme
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contacts"
                  value={formData.contacts || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Adresse URL du contact</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="links01"
                  value={formData.links01 || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* <Col md={6} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Lien 1 Type</Form.Label>
                <Form.Control
                  type="text"
                  name="typelink01"
                  value={formData.typelink01 || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col> */}
            <Col md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {" "}
                  <strong>Nom du premier lien</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="namelink01"
                  value={formData.namelink01 || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Adresse URL du 2ème lien</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="links02"
                  value={formData.links02 || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* <Col md={6} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Lien 2 Type</Form.Label>
                <Form.Control
                  type="text"
                  name="typelink02"
                  value={formData.typelink02 || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col> */}
            <Col md={6} lg={6}>
              <Form.Group className="mb-5">
                <Form.Label>
                  <strong>Nom du 2ème lien</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="namelink02"
                  value={formData.namelink02 || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <h4>VISUEL ET ARTICLE</h4>
            <Row>
              <Col md={12} lg={4}>
                <Col md={6} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Photographie</strong>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} lg={12}>
                  <Form.Group className="mb-5">
                    <Form.Label>
                      <strong>Texte alternatif</strong> au cas où l'imege ne
                      s'affiche pas
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="alt"
                      value={formData.alt || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Col>

              <Col xs={12} md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Article</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="article"
                    value={formData.article || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Col xs={12} className="d-flex justify-content-end">
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
            </Col>
          </Row>
        </Form>
      ) : (
        <>
          <h4 style={{ color: "var(--primary-color)" }}>{item.title}</h4>
          <hr />
          <div>
            <div
              className="mb-1 mb-xl-4 me-3 me-3 me-xl-5 me-xxl-5 col-sm-5 col-md-5 col-xl-4 col-xxl-5  img-fluid float-start"
              style={{ width: item.size + "%" }}
            >
              <LazyLoadImage
                src={
                  item.src
                    ? `${
                        item.src.startsWith("http")
                          ? item.src
                          : import.meta.env.BASE_URL + item.src
                      }?v=${item.cacheBust || 0}`
                    : ""
                }
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
          </div>{" "}
          {/* End of main content block */}
          {onBackClick && backButtonText && (
            <Button
              className="btn-main-blue mt-3 text-start d-block"
              onClick={onBackClick}
            >
              {backButtonText}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
