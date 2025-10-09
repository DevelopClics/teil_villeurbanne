import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import facebookIconInverted from "../../assets/images/icons/facebook-icon-inverted.svg";
import linkedinIconInverted from "../../assets/images/icons/linkedin-icon-inverted.svg";
import logoTV from "../../assets/images/logos/logo_villeurbanne-le-teil_footer.svg";
import leTeilLogo from "../../assets/images/logos/Le_Teil_Logo_Vecto_BLANC.svg";
import villeurbanneLogo from "../../assets/images/logos/Villeurbanne_Ville_Logo_Vecto_BLANC.svg";
import fondationLogo from "../../assets/images/logos/Fondation_France_Logo_Seul_Vecto_BLANC.svg";

import "./Footer.css";

const Footer = ({ show, handleClose, handleShow, modalTitle, modalBody }) => {
  const handleLogoClick = () => {
    window.scrollTo(0, 0);
  };

  const mentionsLegalesContent = (
    <Container fluid>
      <Row>
        <Col xs={12} lg={6}>
          <p>
            <strong>Éditeur du site</strong>
            <br />
            Association pour le Développement des Coopérations Territoriales -
            ADCT
            <br />5 rue Colette Bonzo - 07400 LE TEIL
          </p>
          <p>
            <strong>Directrice de la publication</strong>
            <br />
            Alice Sébastien
          </p>
        </Col>
        <Col md={6}>
          <p>
            <strong>Création graphique</strong>
            <br />
            Genaro Studio - Lyon
          </p>
          <p>
            <strong>Développement web</strong>
            <br />
            Déclic et des Claps - Julien Goscicki - Le Teil
          </p>
          <p>
            <strong>Hébergement</strong>
            <br />
            OVHcloud
            <br />2 rue Kellermann 59100 Roubaix
          </p>
        </Col>
      </Row>
    </Container>
  );

  const confidentialiteContent = (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <p>
            <strong>Collecte des données personnelles :</strong>
            <br />
            Les informations recueillies sur ce site sont utilisées uniquement
            dans le cadre de votre demande et de la relation commerciale qui
            peut en découler. Conformément à la loi "Informatique et Libertés"
            du 6 janvier 1978 modifiée, vous bénéficiez d’un droit d’accès, de
            rectification et de suppression des informations qui vous
            concernent.
          </p>
        </Col>
        <Col xs={12} lg={6}>
          <p>
            <strong>Cookies :</strong>
            <br />
            Ce site ne fait aucune utilisation de cookies.
          </p>
        </Col>
      </Row>
    </Container>
  );

  return (
    <footer className="footer">
      <div className="footer-content">
        <Container fluid className="main-content-wrapper">
          {/* Logos and infos rows and cols */}
          <Row className="gx-0 justify-content-center">
            <Col xs={11} sm={11} md={9} lg={7} xl={6} xxl={7}>
              <Row>
                {/* Logos col */}

                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  xxl={4}
                  className="mb-5 mb-sm-5 mb-xl-5"
                >
                  <Link to="/" onClick={handleLogoClick}>
                    <img
                      src={logoTV}
                      alt="Logo TV"
                      className="pe-5 me-5 mb-4 logo-tv"
                    />
                  </Link>

                  <div className="footer-logos-row">
                    <img
                      src={leTeilLogo}
                      alt="Le Teil Logo"
                      className="footer-logo"
                    />
                    <img
                      src={villeurbanneLogo}
                      alt="Villeurbanne Logo"
                      className="footer-logo"
                    />
                  </div>
                </Col>

                {/* SEPARATOR INFOS UTILES */}
                <Col
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                  xxl={1}
                  className="separator-col"
                >
                  <div className="vertical-separator-left"></div>
                </Col>

                {/* info Left col */}
                <Col
                  xs={11}
                  sm={5}
                  md={4}
                  lg={4}
                  xl={4}
                  xxl={3}
                  className="info-utiles-col mb-2 mb-sm-0"
                  style={{ position: "relative" }}
                >
                  {/* SEPARATEUR */}
                  <h5>INFOS UTILES</h5>
                  <ul>
                    <li>
                      <Link to="/contact">Nous écrire</Link>
                    </li>

                    <li>
                      <a href="#recevoir-newsletter" className="disabled">
                        Notre newsletter
                      </a>
                    </li>
                    <li>
                      <Link to="/team">L'équipe</Link>
                    </li>
                    <li>
                      <a href="#sites-amis" className="disabled">
                        Les sites amis
                      </a>
                    </li>
                  </ul>
                </Col>

                {/* separator col */}

                <Col
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                  xxl={1}
                  className="separator-col"
                >
                  <div className="vertical-separator-right"></div>
                </Col>

                {/* info right col */}
                <Col
                  xs={11}
                  sm={5}
                  md={4}
                  lg={5}
                  xl={4}
                  xxl={3}
                  className="info-legales-col"
                >
                  <h5>INFOS LÉGALES</h5>
                  <ul>
                    <li>
                      <a
                        href="#mentions-legales"
                        onClick={() =>
                          handleShow("Mentions Légales", mentionsLegalesContent)
                        }
                      >
                        Mentions légales
                      </a>
                    </li>
                    <li>
                      <a
                        href="#confidentialite"
                        onClick={() =>
                          handleShow("Confidentialité", confidentialiteContent)
                        }
                      >
                        Confidentialité
                      </a>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>
            {/* Support and social network col */}
            <Col xs={12} sm={12} md={2} lg={4} xl={4} xxl={3}>
              <Row>
                {/* social network col */}
                <Col
                  xs={3}
                  sm={3}
                  md={12}
                  lg={12}
                  xl={12}
                  xxl={12}
                  className="text-end"
                >
                  <div className="social-icons">
                    <div className="social-icons-row">
                      <a href="#facebook">
                        <img src={facebookIconInverted} alt="Facebook" />
                      </a>
                      <a href="#linkedin">
                        <img src={linkedinIconInverted} alt="LinkedIn" />
                      </a>
                    </div>
                  </div>
                </Col>

                {/* Support  col and square logo*/}
                <Col
                  xs={8}
                  sm={8}
                  md={8}
                  lg={12}
                  xl={10}
                  xxl={12}
                  className="text-end  pt-lg-5 mt-lg-5 pt-xxl-0 mt-xxl-0"
                >
                  <Row>
                    <div className="supporter-container pt-0 mt-0 pt-md-5 mt-md-5">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <p className="white-text">Ils nous soutiennent</p>
                      </Col>
                      <Col xs={2} sm={2} md={4} lg={3} xl={1} xxl={3}>
                        <img
                          src={fondationLogo}
                          alt="Logo"
                          className="pe-xl-1 me-xl-1 mb-4 logo-ffr"
                          style={{ marginTop: "-4vh" }}
                        />
                      </Col>
                    </div>
                  </Row>
                </Col>
              </Row>
              {/* Support  col */}
            </Col>
          </Row>
        </Container>

        <Modal
          show={show}
          onHide={handleClose}
          centered
          dialogClassName="modal-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalBody}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </footer>
  );
};

export default Footer;
