import React, { useState, useEffect, useRef } from "react";
import { Carousel, Button, Form } from "react-bootstrap";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./Carousel.css";
import { useAuth } from "../../context/AuthContext"; // Added import

const CarouselComponent = ({
  isNavbarHovered,
  isEditable,
  category, // New prop for carousel category
  startFaded,
}) => {
  const [localSlides, setLocalSlides] = useState([]); // Initialize as empty array
  const [isFaded, setIsFaded] = useState(startFaded);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const formRef = useRef(null); // Add this line
  const heroSectionRef = useRef(null); // Add this line

  // State for inline editing of slides
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCreatingNewSlide, setIsCreatingNewSlide] = useState(false);

  const { token } = useAuth(); // Get token from AuthContext

  useEffect(() => {
    if (startFaded) {
      const timer = setTimeout(() => {
        setIsFaded(false);
      }, 500); // Delay before fading in
      return () => clearTimeout(timer);
    }
  }, [startFaded]);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/carouselImages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Filter slides based on the category prop
        setLocalSlides(response.data[category] || []);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
        setLocalSlides([]); // Set to empty array on error
      }
    };

    if (category) {
      fetchCarouselImages();
    }
  }, [category]); // Re-fetch when category changes

  useEffect(() => {
    if ((editingSlideId || isCreatingNewSlide) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [editingSlideId, isCreatingNewSlide]);

  const handleDelete = async (slideId) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      try {
        const allCarouselImagesResponse = await axios.get(
          "http://localhost:3001/carouselImages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const allCarouselImages = allCarouselImagesResponse.data;

        const updatedAllCarouselImages = { ...allCarouselImages };
        let slideFound = false;
        for (const cat in updatedAllCarouselImages) {
          if (Array.isArray(updatedAllCarouselImages[cat])) {
            const initialLength = updatedAllCarouselImages[cat].length;
            updatedAllCarouselImages[cat] = updatedAllCarouselImages[
              cat
            ].filter((slide) => slide.id !== slideId);
            if (updatedAllCarouselImages[cat].length < initialLength) {
              slideFound = true;
              break;
            }
          }
        }

        if (!slideFound) {
          console.error("Slide not found in any category.");
          return;
        }

        await axios.put(
          "http://localhost:3001/carouselImages",
          updatedAllCarouselImages,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLocalSlides((prevSlides) =>
          prevSlides.filter((slide) => slide.id !== slideId)
        );
      } catch (error) {
        console.error("Error deleting slide:", error);
      }
    }
  };

  const handleCreate = () => {
    setIsCreatingNewSlide(true);
    setEditingSlideId(null); // Ensure no existing slide is being edited
    setFormData({}); // Clear form data for new slide
    setSelectedFile(null); // Clear selected file
  };

  const handleEditSlideClick = (slide) => {
    setEditingSlideId(slide.id);
    setIsCreatingNewSlide(false); // Ensure we are not in creation mode
    setFormData(slide);
    setSelectedFile(null);
  };

  const handleCancelSlideClick = () => {
    setEditingSlideId(null);
    setFormData({});
    setSelectedFile(null);
    setIsCreatingNewSlide(false);

    if (heroSectionRef.current) {
      heroSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveSlideClick = async () => {
    let imageUrl = formData.src;

    if (selectedFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("image", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:3001/upload/carousel",
          uploadFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = response.data.url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    const slideDataToSave = { ...formData, src: imageUrl };

    try {
      const allCarouselImagesResponse = await axios.get(
        "http://localhost:3001/carouselImages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const allCarouselImages = allCarouselImagesResponse.data;

      const updatedAllCarouselImages = { ...allCarouselImages };
      let targetCategoryArray = updatedAllCarouselImages[category] || [];

      if (isCreatingNewSlide) {
        const allSlides = Object.values(allCarouselImages).flat();
        const newId =
          allSlides.length > 0
            ? Math.max(...allSlides.map((s) => s.id)) + 1
            : 1;
        slideDataToSave.id = newId;
        targetCategoryArray.push(slideDataToSave);
      } else {
        targetCategoryArray = targetCategoryArray.map((s) =>
          s.id === formData.id ? { ...s, ...slideDataToSave } : s
        );
      }

      updatedAllCarouselImages[category] = targetCategoryArray;

      await axios.put(
        "http://localhost:3001/carouselImages",
        updatedAllCarouselImages,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLocalSlides(targetCategoryArray);

      setEditingSlideId(null);
      setSelectedFile(null);
      setIsCreatingNewSlide(false);

      if (heroSectionRef.current) {
        heroSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } catch (error) {
      console.error("Error saving slide:", error);
    }
  };

  return (
    <>
      <section
        className={`hero-section ${
          isNavbarHovered || isFaded ? "navbar-hovered" : ""
        } carousel-${category}`}
        ref={heroSectionRef}
      >
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          controls={true}
          indicators={true}
        >
          {localSlides.length > 0 ? (
            localSlides.map((slide) => (
              <Carousel.Item key={slide.id} className="carousel-item-container">
                {isEditable && (
                  <div className="carousel-admin-buttons">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleCreate}
                      className="carousel-admin-button"
                    >
                      Ajouter
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEditSlideClick(slide)}
                      className="carousel-admin-button"
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(slide.id)}
                      className="carousel-admin-button"
                    >
                      Supprimer
                    </Button>
                  </div>
                )}
                <LazyLoadImage
                  src={`${import.meta.env.BASE_URL}${
                    slide.src
                  }?v=${Date.now()}`}
                  alt={slide.alt}
                  className="            
                  w-100 hero-image"
                  effect="blur"
                  width="100%"
                  height="100%"
                />
              </Carousel.Item>
            ))
          ) : (
            <Carousel.Item className="carousel-item-container">
              <div className="empty-carousel-placeholder">
                {isEditable && (
                  <div className="carousel-admin-buttons">
                    <Button variant="success" size="sm" onClick={handleCreate}>
                      Ajouter
                    </Button>
                  </div>
                )}
                <p>
                  Aucune image. Cliquer sur le bouton "Ajouter" pour en afficher
                  une.
                </p>
              </div>
            </Carousel.Item>
          )}
        </Carousel>
        <div className="hero-text">
          {localSlides[index] && localSlides[index].title && (
            <div className="hero-title-block">
              <h1>{localSlides[index].title}</h1>
            </div>
          )}
          {localSlides[index] && localSlides[index].text && (
            <div className="hero-paragraph-block">
              <p>{localSlides[index].text}</p>
            </div>
          )}
        </div>
      </section>

      {isEditable && (editingSlideId || isCreatingNewSlide) && (
        <div className="carousel-edit-form-container" ref={formRef}>
          <div className="container">
            <Form>
              <h4>
                {isCreatingNewSlide
                  ? "Ajouter une nouvelle image"
                  : "Modifier l'image"}
              </h4>
              <Form.Group className="mb-3">
                <Form.Label>Fichier image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Texte alternatif (Alt) au cas où l'imge ne s'affiche pas
                </Form.Label>
                <Form.Control
                  type="text"
                  name="alt"
                  value={formData.alt || ""}
                  onChange={handleFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Texte</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="text"
                  value={formData.text || ""}
                  onChange={handleFormChange}
                />
              </Form.Group>
              <Button
                variant="success"
                onClick={handleSaveSlideClick}
                className="me-2"
              >
                Sauvegarder
              </Button>
              <Button variant="secondary" onClick={handleCancelSlideClick}>
                Annuler
              </Button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default CarouselComponent;
