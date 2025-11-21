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
import { TbArrowBigUpLinesFilled, TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";

export default function AllProj({ isNavbarHovered }) {
  const categoryMap = {
    culture: "Culture",
    food: "Alimentation",
    youth: "Jeunesse",
    economy: "Économie",
  };
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
  const rawApiUrl = import.meta.env.VITE_API_URL;
  const API_URL =
    rawApiUrl ||
    "https://developpement-des-cooperations-territoriales-asso.org/api";
  const BASE_URL = API_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");

  const getImageUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    const path = src.startsWith("/") ? src : `/${src}`;
    return `${BASE_URL}${path}`;
  };
  console.log("API_URL =", API_URL); // Pour tester si elle est bien lue
  // `${API_URL}/projects`
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
        const response = await fetch(`${API_URL}/projects`, {
          headers,
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
        setAllProjects(sortedData);
      } catch (error) {
        console.error("Error fetching all projects:", error);
      }
    };

    fetchAllProjects();
  }, [isAuthenticated]);

  const handleMoveToTop = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/projects/${projectId}/move_to_top`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllProjects(response.data);
    } catch (error) {
      console.error("Error moving project to top on backend:", error);
    }
  };

  const handleMoveUp = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/projects/${projectId}/move_up`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllProjects(response.data);
    } catch (error) {
      console.error("Error moving project up:", error);
    }
  };

  const handleMoveDown = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/projects/${projectId}/move_down`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllProjects(response.data);
    } catch (error) {
      console.error("Error moving project down:", error);
    }
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
                        const categoryToNavigate = item.category ? item.category.toLowerCase() : 'all';
                        navigate(`/projects/${categoryToNavigate}`, {
                          state: {
                            projectId: item.id,
                            projectCategory: item.category,
                          },
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="project-category-label">
                        {categoryMap[item.category] || item.category}
                      </div>

                      {item.src && (
  <LazyLoadImage
    wrapperClassName="square-img"
    className="img-content-fit"
    src={getImageUrl(item.src)}
    alt={item.alt}
    effect="blur"
    width="100%"
    height="100%"
  />
)}
                      {/* {isAuthenticated && (
                        <Button
                          variant="info"
                          className="mt-2"
                          style={{ display: "none" }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when button is clicked
                            handleMoveToTop(item.id);
                          }}
                        >
                          Faire monter en top position
                        </Button>
                      )} */}
                      <div className="project-info-box">
                        <h4 className="project-info-title">{item.shortitle}</h4>
                        <p className="project-info-text">{item.shortext}</p>
                      </div>
                      {isAuthenticated && (
                        <div className="admin-controls-all-proj d-flex justify-content-center">
                          <Button
                            variant="info"
                            className="bi me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveToTop(item.id)}
                            }
                          >
                            <TbArrowBigUpLinesFilled size={30} />
                          </Button>
                          <Button
                            variant="info"
                            className="me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveUp(item.id)}
                            }
                          >
                            <TbArrowBigUp size={30} />
                          </Button>
                          <Button
                            variant="info"
                            className="me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveDown(item.id)}
                            }
                          >
                            <TbArrowBigDown size={30} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Col>
                ))
              ) : (
                <div>Pas de projet à afficher.</div>
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
