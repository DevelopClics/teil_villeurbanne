import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import "../App.css";

import Breadcrumbs from "../components/breadcrumbs/Breadcrumbs";
import CarouselComponent from "../components/Carousel/Carousel";
import PageLayout from "../components/layouts/PageLayout";
import ProjectLayout from "../components/layouts/ProjectLayout";
import ErrComp from "../components/ErrComp";

export default function NotFound({ isNavbarHovered }) {
  const SUB = "Erreur 404";
  const { isAuthenticated } = useAuth();
  const [error404, setError404s] = useState([]);

  const fetchError404 = async () => {
    try {
      const response = await axios.get("/api/error404");
      setError404s(response.data);
      console.log("Fetched error 404:", response.data);
    } catch (error) {
      console.error("Error fetching error 404:", error);
    }
  };

  useEffect(() => {
    fetchError404();
  }, []);

  const handleUpdateError404 = async (id, updatedError404, file) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in updatedPlace) {
        formData.append(key, updatedError404[key]);
      }

      if (file) {
        formData.append("image", file);
      }

      const response = await axios.put(`/api/errr404/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        console.log("Server response:", response.data);
        setError404((prevProjects) =>
          prevProjects.map((project) =>
            project.id === id ? response.data : project
          )
        );
      }
    } catch (error) {
      console.error("Error updating error 404:", error);
    }
  };

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="error404"
        carouselTextId={3}
        isEditable={isAuthenticated}
        startFaded={true}
        stationaryText={false}
      />
      <Breadcrumbs breadcrumbsnav="Page non trouvée" breadcrumbssub={SUB} />
      <PageLayout
        title={SUB}
        titleId="not-found-title"
        DescriptionComponent={
          <>
            <ErrComp />

            <div className="d-flex justify-content-center mt-4"></div>
          </>
        }
      />
    </>
  );
}
