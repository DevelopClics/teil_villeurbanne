import React, { useState, useEffect, useRef } from "react";
import { Carousel, Button, Form } from "react-bootstrap";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./Carousel.css";
import { useAuth } from "../../context/AuthContext"; // Added import

const CarouselComponent = ({
  isNavbarHovered,
  title,
  carouselTextId,
  isEditable,
  category, // New prop for carousel category
}) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [text, setText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [localSlides, setLocalSlides] = useState([]); // Initialize as empty array

  const formRef = useRef(null); // Add this line
  const textEditRef = useRef(null); // Add this line
  const heroSectionRef = useRef(null); // Add this line

  // State for inline editing of slides
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCreatingNewSlide, setIsCreatingNewSlide] = useState(false);

  const { token } = useAuth(); // Get token from AuthContext

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
    const fetchCarouselText = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/carouselText/${carouselTextId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setText(response.data.content);
        setEditedText(response.data.content);
      } catch (error) {
        console.error("Error fetching carousel text:", error);
      }
    };
    if (carouselTextId !== undefined) {
      fetchCarouselText();
    }
  }, [carouselTextId]);

  useEffect(() => {
    if (isEditingText && textEditRef.current) {
      textEditRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isEditingText]);

  useEffect(() => {
    if ((editingSlideId || isCreatingNewSlide) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editingSlideId, isCreatingNewSlide]);

  const handleEditClick = () => {
    setIsEditingText(true);
  };

  const handleSaveTextClick = async () => {
    try {
      // const token = localStorage.getItem("token"); // Token is already available from useAuth()
      await axios.put(
        `http://localhost:3001/carouselText/${carouselTextId}`,
        { content: editedText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setText(editedText);
      setIsEditingText(false);
    } catch (error) {
      console.error("Error updating carousel text:", error);
    }
  };

  const handleCancelTextClick = () => {
    setIsEditingText(false);
    setEditedText(text);
  };

  const handleDelete = async (slideId) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      try {
        // const token = localStorage.getItem("token"); // Token is already available from useAuth()
        // Fetch all carousel images first
        const allCarouselImagesResponse = await axios.get(
          "http://localhost:3001/carouselImages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const allCarouselImages = allCarouselImagesResponse.data;

        // Find the category and remove the slide
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

        // Send the updated entire carouselImages object back to the server
        await axios.put(
          "http://localhost:3001/carouselImages",
          updatedAllCarouselImages,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update local state to reflect the change
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

  // --- Inline Editing Handlers --- //
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

    // Scroll up to the hero section
    if (heroSectionRef.current) {
      heroSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        // const token = localStorage.getItem("token"); // Token is already available from useAuth()
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
        return; // Don't save if upload fails
      }
    }

    const slideDataToSave = { ...formData, src: imageUrl };

    try {
      // const token = localStorage.getItem("token"); // Token is already available from useAuth()

      // Fetch all carousel images first
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
        // Generate a new ID for the new slide
        const allSlides = Object.values(allCarouselImages).flat();
        const newId =
          allSlides.length > 0
            ? Math.max(...allSlides.map((s) => s.id)) + 1
            : 1;
        slideDataToSave.id = newId;
        targetCategoryArray.push(slideDataToSave);
      } else {
        // Update existing slide
        targetCategoryArray = targetCategoryArray.map((s) =>
          s.id === formData.id ? { ...s, ...slideDataToSave } : s
        );
      }

      updatedAllCarouselImages[category] = targetCategoryArray;

      // Send the updated entire carouselImages object back to the server
      await axios.put(
        "http://localhost:3001/carouselImages",
        updatedAllCarouselImages,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setLocalSlides(targetCategoryArray);

      setEditingSlideId(null);
      setSelectedFile(null);
      setIsCreatingNewSlide(false);

      // Scroll up to the hero section
      if (heroSectionRef.current) {
        heroSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error("Error saving slide:", error);
    }
  };

  return (
    <>
      <section
        className={`hero-section ${isNavbarHovered ? "navbar-hovered" : ""} ${
          localSlides.length === 0 ? "empty-carousel-background" : ""
        }`}
        ref={heroSectionRef}
      >
        <Carousel controls={true} indicators={true}>
          {localSlides.length > 0 ? (
            localSlides.map((slide) => (
              <Carousel.Item key={slide.id} className="carousel-item-container">
                {isEditable && (
                  <div className="carousel-admin-buttons">
                    <Button variant="success" size="sm" onClick={handleCreate} className="carousel-admin-button">
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
                  className="d-block w-100 hero-image"
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
          <div className="hero-title-block">
            <h1>{title}</h1>
          </div>
          <div className="hero-paragraph-block">
            {isEditable && isEditingText ? (
              <>
                <textarea
                  className="form-control"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows="10"
                  ref={textEditRef}
                />
                <Button
                  variant="success"
                  className="mt-2"
                  onClick={handleSaveTextClick}
                >
                  Enregistrer
                </Button>
                <Button
                  variant="secondary"
                  className="mt-2 ms-2"
                  onClick={handleCancelTextClick}
                >
                  Annuler
                </Button>
              </>
            ) : (
              <p>
                {isEditable && (
                  <Button variant="main-blue" onClick={handleEditClick}>
                    Modifier le texte
                  </Button>
                )}
                {text}
              </p>
            )}
          </div>
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
