import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";
import facebookIconInverted from "../../assets/images/icons/facebook-icon-inverted.svg";
import linkedinIconInverted from "../../assets/images/icons/linkedin-icon-inverted.svg";
import logoTV from "../../assets/images/logos/logo_villeurbanne-le-teil_footer.svg";
import leTeilLogo from "../../assets/images/logos/Le_Teil_Logo_Vecto_BLANC.svg";
import villeurbanneLogo from "../../assets/images/logos/Villeurbanne_Ville_Logo_Vecto_BLANC.svg";
import fondationLogo from "../../assets/images/logos/Fondation_France_Logo_Seul_Vecto_BLANC.svg";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid className="main-content-wrapper app-container-padding">
        {/* Logos and infos rows and cols */}
        <Row className="gx-0">
          <Col xs={12} sm={12} md={10} lg={8} xl={8} xxl={9}>
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
                <Link to="/">
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

              {/* SEPARATOR INFOS UTTILES */}
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
                    <a href="#recevoir-newsletter">Notre newsletter</a>
                  </li>
                  <li>
                    <Link to="/team">L'équipe</Link>
                  </li>
                  <li>
                    <a href="#sites-amis">Les sites amis</a>
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
                    <a href="#mentions-legales">Mentions légales</a>
                  </li>
                  <li>
                    <a href="#confidentialite">Confidentialité</a>
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
    </footer>
  );
};

export default Footer;
