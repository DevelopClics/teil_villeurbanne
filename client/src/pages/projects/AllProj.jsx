import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import CarouselComponent from "../../components/Carousel/Carousel";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

import "./AllProj.css";
import TeamCard from "../../components/Cards/TeamCard";

import EditableTitle from "../../components/EditableTitle";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function AllProj({ isNavbarHovered }) {
  const XS = 12;
  const SM = 12;
  const MD = 6;
  const LG = 4;
  const XL = 3;
  const XXL = 3;
  const IMGPATH = "/images/photos/carousel/projects/";
  const SUB = "Tous les projets";

  const { isAuthenticated } = useAuth();
  const [allProjects, setAllProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(12); // Number of projects per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const headers = {};
        if (isAuthenticated) {
          const token = localStorage.getItem("token");
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }
        const response = await fetch("http://localhost:3001/projects", {
          headers,
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
        const data = await response.json();
        setAllProjects(data);
      } catch (error) {
        console.error("Error fetching all projects:", error);
      }
    };

    fetchAllProjects();
  }, [isAuthenticated]);

  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = allProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(allProjects.length / projectsPerPage);

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        title={SUB}
        category="projects"
        carouselTextId={4}
        isEditable={isAuthenticated}
      />

      <Breadcrumbs breadcrumbsnav="Les projets" breadcrumbssub={SUB} />
      <section className="reason-section" style={{ paddingTop: "50px" }}>
        <Container className="app-container-padding">
          <Row>
            <Col>
              <EditableTitle textId="all-projects-title" defaultTitle={SUB} />
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              )}
              <Row className="g-4">
                {currentProjects.map((item) => (
                  <Col
                    key={`${item.category}-${item.id}`}
                    xs={XS}
                    sm={SM}
                    md={MD}
                    lg={LG}
                    xl={XL}
                    xxl={XXL}
                  >
                    <div
                      className="square-img-container"
                      onClick={() =>
                        navigate(`/${item.category.toLowerCase()}/${item.id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {console.log(
                        "Navigating to:",
                        `/${item.category.toLowerCase()}/${item.id}`
                      )}
                      <div className="project-category-label">
                        {item.category}
                      </div>

                      <LazyLoadImage
                        wrapperClassName="square-img"
                        src={`${import.meta.env.BASE_URL}${item.src}`}
                        alt={item.alt}
                        effect="blur"
                        width="100%"
                        height="100%"
                      />
                      <div className="project-info-box">
                        <h4 className="project-info-title">{item.title}</h4>
                        <p className="project-info-text">{item.text}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
