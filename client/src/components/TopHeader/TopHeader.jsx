import React from "react";
import { Container, Row, Col, Image, Stack, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import logoTzc from "../../assets/images/logo-le-teil-villeurbanne.svg";
import facebookIcon from "../../assets/images/icons/facebook-icon.svg";
import linkedinIcon from "../../assets/images/icons/linkedin-icon.svg";
import mailIcon from "../../assets/images/icons/mail-icon.svg";
import "./TopHeader.css";

const TopHeader = ({ socialIconsRef, socialIconsContainerRef }) => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="top-header pt-3 p-md-5">
      <Container>
        <Row className="align-items-center ">
          <Col xl={4} className="d-none d-xl-block">
            {isAuthenticated && (
              <Stack
                direction="horizontal"
                className="justify-content-center justify-content-md-start social-icons-container"
              >
                <Button
                  variant=""
                  onClick={handleLogout}
                  className="btn-salmon no-outline"
                >
                  Se déconnecter
                </Button>
              </Stack>
            )}
          </Col>
          <Col
            xs={12}
            md={6}
            xl={4}
            className="text-center text-md-start text-xl-center mb-3 mb-md-0"
          >
            <Link to=".">
              <Image src={logoTzc} alt="Logo TZC" className="main-logo" fluid />
            </Link>
          </Col>

          <Col xs={12} md={6} xl={3} xxl={4}>
            <div ref={socialIconsContainerRef}>
              <Stack
                ref={socialIconsRef}
                direction="horizontal"
                className="justify-content-center justify-content-md-end social-icons-container"
              >
                <a
                  href="#facebook"
                  className="social-icon-circle facebook-icon"
                >
                  <img src={facebookIcon} alt="Facebook" />
                </a>
                <a
                  href="#linkedin"
                  className="social-icon-circle linkedin-icon"
                >
                  <img src={linkedinIcon} alt="LinkedIn" />
                </a>
                <div className="social-icon-separator"></div>
                <Link className="social-icon-circle" to="/contact">
                  <img src={mailIcon} alt="Mail" />
                </Link>
              </Stack>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopHeader;
