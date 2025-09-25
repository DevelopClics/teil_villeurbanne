import { Container, Row, Col, Pagination, Button } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import EditableTitle from "../../components/EditableTitle";

import "../../App.css";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CarouselComponent from "../../components/Carousel/Carousel";
import ProjectLayout from "../../components/layouts/ProjectLayout";

export default function ProjectCategoryPage({ isNavbarHovered }) {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;
  const { id, category: urlCategory } = useParams();
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [singleProject, setSingleProject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const projectRefs = useRef(new Map());
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);

  const currentCategory = urlCategory || "culture"; // Default to 'culture' if no category in URL

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
          // Fetch all projects for the current category
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
          console.log("Fetched projects data:", data);
          console.log("Current category:", currentCategory);
          const filteredProjects = data.filter((project) =>
            Array.isArray(project.category)
              ? project.category.includes(currentCategory)
              : project.category === currentCategory
          );
          console.log("Filtered projects:", filteredProjects);
          setProjects(filteredProjects);

          // Check if we navigated from AllProj with a specific project
          if (location.state && location.state.projectId) {
            const { projectId } = location.state;
            const projectIndex = filteredProjects.findIndex(
              (project) => project.id === projectId
            );
            if (projectIndex !== -1) {
              const calculatedPage =
                Math.floor(projectIndex / projectsPerPage) + 1;
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
  }, [isAuthenticated, id, urlCategory, location.state, navigate, projectsPerPage]);

  useEffect(() => {
    if (
      location.state &&
      location.state.projectId &&
      projects.length > 0
    ) {
      const { projectId } = location.state;
      const targetElement = projectRefs.current.get(projectId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        // Clear the state after scrolling
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [projects, currentPage, location.state, navigate]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(projects.length / projectsPerPage);

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
          setProjects((prevProjects) =>
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

  const handleSaveNewProject = async (newData, file) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append all new data fields, ensuring category is a string
      for (const key in newData) {
        if (key === "category" && Array.isArray(newData[key])) {
          formData.append(key, newData[key][0]); // Take the first element if it's an array
        } else {
          formData.append(key, newData[key]);
        }
      }

      // Append the file if it exists
      if (file) {
        formData.append("image", file);
      }

      // Ensure currentCategory is added if not already present or if it was an array
      if (!formData.has("category")) {
        formData.append("category", currentCategory);
      }

      // Add a default size if not provided
      if (!newData.size) {
        formData.append("size", "30");
      }

      const response = await axios.post(
        "http://localhost:3001/projects",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        // Assuming 201 Created for successful POST
        const newProject = response.data;
        setProjects((prevProjects) => [...prevProjects, newProject]);
        // Optionally navigate to the new project or clear the form
        // navigate(`/projects/${currentCategory}/${newProject.id}`);
        setIsCreatingNewProject(false);
      }
    } catch (error) {
      console.error("Error creating new project:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3001/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
        // If a single project was being viewed, navigate back to the category page
        if (id) {
          navigate(`/projects/${currentCategory}`);
        }
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleCreateClick = () => {
    setIsCreatingNewProject(true);
  };

  const handleCancelCreateNewProject = () => {
    setIsCreatingNewProject(false);
  };

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category={currentCategory}
        carouselTextId={5}
        isEditable={isAuthenticated}
        stationaryText={true}
      />
      <Breadcrumbs breadcrumbsnav="Nos projets" breadcrumbssub={currentCategory} />
      <section className="reason-section" style={{ paddingTop: "50px" }}>
        <Container className="app-container-padding">
          <Row>
            <Col>
              <EditableTitle
                textId={`${currentCategory}-projects-title`}
                defaultTitle={currentCategory}
              />
              {isAuthenticated && !id && (
                <div className="admin-controls d-flex justify-content-start mb-3">
                  <Button variant="primary" onClick={handleCreateClick} className="btn-main-blue me-2">
                    Créer un nouveau projet
                  </Button>
                </div>
              )}

              {isCreatingNewProject && (
                <ProjectLayout
                  item={{ category: currentCategory }} // Pass initial data for new project
                  isEditable={isAuthenticated}
                  isCreating={true}
                  onSaveNew={handleSaveNewProject}
                  onCancelCreate={handleCancelCreateNewProject}
                />
              )}

              {id && singleProject ? (
                            <ProjectLayout
                              key={singleProject.id}
                              item={singleProject}
                              isEditable={isAuthenticated}
                              onBackClick={() => navigate("/all-projects")}
                              backButtonText="Revenir à tous les projets"
                              onUpdate={handleUpdateProject}
                              onSaveNew={handleSaveNewProject}
                              onDelete={handleDeleteProject}
                            />              ) : (
                currentProjects.map((item) => (
                  <div
                    key={item.id}
                    ref={(el) => projectRefs.current.set(item.id, el)}
                  >
                    <ProjectLayout
                      item={item}
                      isEditable={isAuthenticated}
                      onUpdate={handleUpdateProject}
                      onSaveNew={handleSaveNewProject}
                      onDelete={handleDeleteProject}
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
