import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

import "../../App.css";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CarouselComponent from "../../components/Carousel/Carousel";
import PageLayout from "../../components/layouts/PageLayout";
import ProjectLayout from "../../components/layouts/ProjectLayout";

// const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Places({ isNavbarHovered }) {
  const API_URL = import.meta.env.VITE_API_URL;
  console.log("API_URL =", API_URL); // Pour tester si elle est bien lue
  const SUB = "Les villes";
  const { isAuthenticated } = useAuth();
  const [places, setPlaces] = useState([]);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`${API_URL}/places`);
      setPlaces(response.data);
      console.log("Fetched places:", response.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleUpdatePlace = async (id, updatedPlace, file) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Update text data
      const response = await axios.put(
        `${API_URL}/places/${id}`,
        updatedPlace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let finalProject = response.data;

      // 2. If there is a file, upload it
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadResponse = await axios.post(
          `${API_URL}/places/${id}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        finalProject = uploadResponse.data;
      }

      // 3. Update the state with the final project data
      if (response.status === 200) {
        console.log("Server response:", finalProject);
        setPlaces((prevProjects) =>
          prevProjects.map((project) =>
            project.id === id ? finalProject : project
          )
        );
      }
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="city"
        carouselTextId={3}
        isEditable={isAuthenticated}
        startFaded={true}
        stationaryText={false}
      />
      <Breadcrumbs breadcrumbsnav="Qui sommes-nous ?" breadcrumbssub={SUB} />
      <PageLayout
        title={SUB}
        titleId="places-title"
        DescriptionComponent={
          <>
            {(places || []).map((item) => (
              <ProjectLayout
                key={item.id}
                item={item}
                isEditable={isAuthenticated}
                onUpdate={handleUpdatePlace}
                subtitleLabel="Sous-titre"
                useDatePicker={false}
              />
            ))}
            <div className="d-flex justify-content-center mt-4"></div>
          </>
        }
      />
    </>
  );
}
