import { Container, Row, Col, Pagination } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import EditableTitle from "../../components/EditableTitle";

import "../../App.css";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CarouselComponent from "../../components/Carousel/Carousel";
import ProjectLayout from "../../components/layouts/ProjectLayout";

export default function Culture({ isNavbarHovered }) {
  const SUB = "Culture";
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [cultureProjects, setCultureProjects] = useState([]);
  const [singleProject, setSingleProject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const projectRefs = useRef(new Map());

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const headers = {};
        if (isAuthenticated) {
          const token = localStorage.getItem("token");
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }

        if (id) {
          // Fetch single project
          const response = await fetch(`http://localhost:3001/projects/${id}`, {
            headers,
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${errorText}`
            );
          }
          const data = await response.json();
          setSingleProject(data);
        } else {
          // Fetch all culture projects
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
          const filteredProjects = data.filter((project) => project.category === "culture");
          setCultureProjects(filteredProjects);

          // Check if we navigated from AllProj with a specific project
          if (location.state && location.state.projectId) {
            const { projectId } = location.state;
            const projectIndex = filteredProjects.findIndex(
              (project) => project.id === projectId
            );
            if (projectIndex !== -1) {
              const calculatedPage = Math.floor(projectIndex / projectsPerPage) + 1;
              setCurrentPage(calculatedPage);
            }
            // Clear the state after use
            navigate(location.pathname, { replace: true, state: {} });
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [isAuthenticated, id, location.state, navigate, projectsPerPage]);

  useEffect(() => {
    if (location.state && location.state.projectId && cultureProjects.length > 0) {
      const { projectId } = location.state;
      const targetElement = projectRefs.current.get(projectId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        // Clear the state after scrolling
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [cultureProjects, currentPage, location.state, navigate]);

  

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = cultureProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(cultureProjects.length / projectsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // projectsRef.current.scrollIntoView({ behavior: "smooth" }); // This is no longer needed here
  };

  const handleUpdateProject = async (projectId, updatedData, file) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }

      if (file) {
        formData.append("image", file);
      }

      const response = await axios.put(
        `http://localhost:3001/projects/${projectId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const updatedProject = response.data;
        if (id) {
          setSingleProject(updatedProject);
        } else {
          setCultureProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === projectId ? updatedProject : project
            )
          );
        }
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        title={SUB}
        category="culture"
        carouselTextId={5}
        isEditable={isAuthenticated}
      />
      <Breadcrumbs breadcrumbsnav="Nos projets" breadcrumbssub={SUB} />
      <section className="reason-section" style={{ paddingTop: "50px" }}>
        <Container className="app-container-padding">
          <Row>
            <Col>
              <EditableTitle textId="culture-projects-title" defaultTitle={SUB} />

              {id && singleProject ? (
                <ProjectLayout
                  key={singleProject.id}
                  item={singleProject}
                  isEditable={isAuthenticated}
                  onBackClick={() => navigate("/all-projects")}
                  backButtonText="Revenir à tous les projets"
                  onUpdate={handleUpdateProject}
                />
              ) : (
                currentProjects.map((item) => (
                  <div key={item.id} ref={(el) => projectRefs.current.set(item.id, el)}>
                    <ProjectLayout
                      item={item}
                      isEditable={isAuthenticated}
                      onUpdate={handleUpdateProject}
                    />
                  </div>
                ))
              )}

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
            </Col>{" "}
          </Row>
        </Container>
      </section>
    </>
  );
}
