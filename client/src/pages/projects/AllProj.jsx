import { useEffect, useState } from "react";
import { Pagination, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import CarouselComponent from "../../components/Carousel/Carousel";
import axios from "axios";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import "./AllProj.css";
import PageLayout from "../../components/layouts/PageLayout";
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

  const handleMoveToTop = async (projectId) => {
    setAllProjects((prevProjects) => {
      const projectToMove = prevProjects.find(
        (project) => project.id === projectId
      );
      if (!projectToMove) {
        return prevProjects;
      }
      const filteredProjects = prevProjects.filter(
        (project) => project.id !== projectId
      );
      const newOrder = [projectToMove, ...filteredProjects];

      // Send update to backend
      const updateOrder = async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.patch(
            `http://localhost:3001/projects/${projectId}/move_to_top`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Project moved to top successfully on backend.");
        } catch (error) {
          console.error("Error moving project to top on backend:", error);
        }
      };
      updateOrder();

      return newOrder;
    });
  };

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
        category="projects"
        isEditable={isAuthenticated}
        startFaded={true}
      />

      <Breadcrumbs breadcrumbsnav="Les projets" breadcrumbssub={SUB} />
      <PageLayout
        title={SUB}
        titleId="all-projects-title"
        DescriptionComponent={
          <>
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
              {currentProjects.length > 0 ? (
                currentProjects.map((item) => (
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
                      onClick={() => {
                        if (item.category) {
                          navigate(
                            `/projects/${item.category.toLowerCase()}`,
                            {
                              state: {
                                projectId: item.id,
                                projectCategory: item.category,
                              },
                            }
                          );
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="project-category-label">
                        {item.panel}
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
                        <h4 className="project-info-title">
                          {item.shortitle}
                        </h4>
                        <p className="project-info-text">{item.shortext}</p>
                      </div>
                      {isAuthenticated && (
                        <Button
                          variant="info"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when button is clicked
                            handleMoveToTop(item.id);
                          }}
                        >
                          Faire monter en premier
                        </Button>
                      )}
                    </div>
                  </Col>
                ))
              ) : (
                <div>No projects to display.</div>
              )}
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
          </>
        }
      />
    </>
  );
}
