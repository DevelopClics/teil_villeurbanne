import { Pagination, Button } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

import "../../App.css";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CarouselComponent from "../../components/Carousel/Carousel";
import ProjectLayout from "../../components/layouts/ProjectLayout";
import PageLayout from "../../components/layouts/PageLayout";

export default function ProjectCategoryPage({ isNavbarHovered }) {
  const API_URL = import.meta.env.VITE_API_URL;
  console.log("API_URL =", API_URL); // Pour tester si elle est bien lue

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

  const categoryMap = {
    culture: "Culture",
    food: "Alimentation",
    youth: "Jeunesse",
    economy: "Économie",
  };
  const currentCategory = urlCategory || "culture";
  const displayCategory = categoryMap[currentCategory] || currentCategory;

  const categoryToCarouselId = {
    culture: 5,
    food: 6,
    youth: 7,
    economy: 8,
  };
  const carouselId = categoryToCarouselId[currentCategory];

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
          const response = await fetch(`${API_URL}/projects/${id}`, {
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
          console.log("Fetched projects data:", data);
          console.log("Current category:", currentCategory);
          const filteredProjects = data.filter((project) =>
            Array.isArray(project.category)
              ? project.category.includes(currentCategory)
              : project.category === currentCategory
          );
          const sortedProjects = filteredProjects.sort((a, b) => new Date(a.subtitle) - new Date(b.subtitle));
          console.log("Filtered projects:", sortedProjects);
          setProjects(sortedProjects);

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
  }, [
    isAuthenticated,
    id,
    urlCategory,
    location.state,
    navigate,
    projectsPerPage,
    API_URL,
    currentCategory,
    location.pathname,
  ]);

  useEffect(() => {
    if (location.state && location.state.projectId && projects.length > 0) {
      const { projectId } = location.state;
      const targetElement = projectRefs.current.get(projectId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        // Clear the state after scrolling
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [projects, currentPage, location.state, navigate, location.pathname]);

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
        `${API_URL}/projects/${projectId}`,
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
        if (updatedProject.category !== urlCategory) {
          navigate(`/projects/${updatedProject.category}`);
        } else {
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
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleSaveNewProject = async (newData, file) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append all new data fields
      for (const key in newData) {
        formData.append(key, newData[key]);
      }

      // Append the file if it exists
      if (file) {
        formData.append("image", file);
      }

      // Add a default size if not provided
      if (!newData.size) {
        formData.append("size", "30");
      }

      const response = await axios.post(
        `${API_URL}/projects`,
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
        navigate(`/projects/${newProject.category}`);
        setIsCreatingNewProject(false);
      }
    } catch (error) {
      console.error("Error creating new project:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const handleMoveToTop = async (projectId) => {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex > 0) {
      const newProjects = [...projects];
      const [movedProject] = newProjects.splice(projectIndex, 1);
      newProjects.unshift(movedProject);
      setProjects(newProjects); // Optimistic update

      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `${API_URL}/projects/${projectId}/move_to_top`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error moving project to top:", error);
        setProjects(projects); // Revert on error
      }
    }
  };

  const handleMoveUp = async (projectId) => {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex > 0) {
      const newProjects = [...projects];
      const [movedProject] = newProjects.splice(projectIndex, 1);
      newProjects.splice(projectIndex - 1, 0, movedProject);
      setProjects(newProjects); // Optimistic update

      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `${API_URL}/projects/${projectId}/move_up`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error moving project up:", error);
        setProjects(projects); // Revert on error
      }
    }
  };

  const handleMoveDown = async (projectId) => {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex < projects.length - 1) {
      const newProjects = [...projects];
      const [movedProject] = newProjects.splice(projectIndex, 1);
      newProjects.splice(projectIndex + 1, 0, movedProject);
      setProjects(newProjects); // Optimistic update

      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `${API_URL}/projects/${projectId}/move_down`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error moving project down:", error);
        setProjects(projects); // Revert on error
      }
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
        carouselTextId={carouselId}
        isEditable={isAuthenticated}
        startFaded={true}
      />
      <Breadcrumbs
        breadcrumbsnav="Nos projets"
        breadcrumbssub={displayCategory}
      />
      <PageLayout
        title={displayCategory}
        titleId={`${currentCategory}-projects-title`}
        DescriptionComponent={
          <>
            {isAuthenticated && !id && (
              <div className="admin-controls d-flex justify-content-start mb-3">
                <Button
                  variant="primary"
                  onClick={handleCreateClick}
                  className="btn-teal me-2"
                >
                  Créer un nouveau projet
                </Button>
              </div>
            )}

            {isCreatingNewProject && (
              <ProjectLayout
                isProjectPage={true}
                item={{ category: currentCategory }} // Pass initial data for new project
                isEditable={isAuthenticated}
                isCreating={true}
                onSaveNew={handleSaveNewProject}
                onCancelCreate={handleCancelCreateNewProject}
                category={currentCategory}
                subtitleLabel="Dates"
                useDatePicker={true}
              />
            )}

            {id && singleProject ? (
              <ProjectLayout
                isProjectPage={true}
                key={singleProject.id}
                item={singleProject}
                isEditable={isAuthenticated}
                onBackClick={() => navigate("/all-projects")}
                backButtonText="Revenir à tous les projets"
                onUpdate={handleUpdateProject}
                onSaveNew={handleSaveNewProject}
                onDelete={handleDeleteProject}
                subtitleLabel="Sous-Dates"
                useDatePicker={true}
              />
            ) : (
              currentProjects.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => projectRefs.current.set(item.id, el)}
                >
                  <ProjectLayout
                    isProjectPage={true}
                    item={item}
                    isEditable={isAuthenticated}
                    onUpdate={handleUpdateProject}
                    onSaveNew={handleSaveNewProject}
                    onDelete={handleDeleteProject}
                    onMoveToTop={handleMoveToTop}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    subtitleLabel="Dates"
                    useDatePicker={true}
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
          </>
        }
      />
    </>
  );
}
