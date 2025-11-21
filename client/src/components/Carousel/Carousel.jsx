import React, { useState, useEffect, useRef } from "react";
import { Carousel, Button, Form } from "react-bootstrap";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./Carousel.css";
import { useAuth } from "../../context/AuthContext";

const CarouselComponent = ({
  isNavbarHovered,
  isEditable,
  category,
  startFaded,
}) => {
  const rawApiUrl = import.meta.env.VITE_API_URL;
  const API_URL =
    rawApiUrl ||
    "https://developpement-des-cooperations-territoriales-asso.org/api";
  const BASE_URL = API_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");

  const [localSlides, setLocalSlides] = useState([]);
  const [isFaded, setIsFaded] = useState(startFaded);
  const [index, setIndex] = useState(0);

  const formRef = useRef(null);
  const heroSectionRef = useRef(null);

  const [editingSlideId, setEditingSlideId] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCreatingNewSlide, setIsCreatingNewSlide] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    if (startFaded) {
      const timer = setTimeout(() => setIsFaded(false), 500);
      return () => clearTimeout(timer);
    }
  }, [startFaded]);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/carouselImages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocalSlides(response.data[category] || []);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
        setLocalSlides([]);
      }
    };
    if (category) fetchCarouselImages();
  }, [category, token]);

  useEffect(() => {
    if ((editingSlideId || isCreatingNewSlide) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [editingSlideId, isCreatingNewSlide]);

  const handleSelect = (selectedIndex) => setIndex(selectedIndex);

  const handleDelete = async (slideId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette image ?")) return;
    try {
      const response = await axios.get(`${API_URL}/carouselImages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allCarouselImages = response.data;
      const updatedAllCarouselImages = { ...allCarouselImages };
      let found = false;

      for (const cat in updatedAllCarouselImages) {
        if (Array.isArray(updatedAllCarouselImages[cat])) {
          const initialLength = updatedAllCarouselImages[cat].length;
          updatedAllCarouselImages[cat] = updatedAllCarouselImages[cat].filter(
            (s) => s.id !== slideId
          );
          if (updatedAllCarouselImages[cat].length < initialLength) {
            found = true;
            break;
          }
        }
      }

      if (!found) return;

      await axios.put(`${API_URL}/carouselImages`, updatedAllCarouselImages, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocalSlides((prev) => prev.filter((s) => s.id !== slideId));
    } catch (error) {
      console.error("Error deleting slide:", error);
    }
  };

  const handleCreate = () => {
    setIsCreatingNewSlide(true);
    setEditingSlideId(null);
    setFormData({});
    setSelectedFile(null);
  };

  const handleEditSlideClick = (slide) => {
    console.log("--- EDIT CLICKED ---");
    console.log("Setting isCreatingNewSlide to false");
    setEditingSlideId(slide.id);
    setIsCreatingNewSlide(false);
    setFormData({ ...slide }); // conserver l'id et src
    setSelectedFile(null);
  };

  const handleCancelSlideClick = () => {
    setEditingSlideId(null);
    setFormData({});
    setSelectedFile(null);
    setIsCreatingNewSlide(false);
    if (heroSectionRef.current)
      heroSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    // Mettre à jour formData.src pour l'aperçu
    setFormData((prev) => ({
      ...prev,
      src: `/uploads/temp/${file.name}`, // chemin temporaire pour preview
    }));
  };

  const handleSaveSlideClick = async () => {
    console.log("--- SAVE CLICKED ---");
    console.log("isCreatingNewSlide:", isCreatingNewSlide);
    console.log("formData:", formData);
    try {
      let uploadedImageUrl = formData.src;

      // Upload si fichier sélectionné
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedFile);
        const uploadResponse = await axios.post(
          `${API_URL}/upload/carousel`,
          uploadFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadedImageUrl = uploadResponse.data.src.replace(
          /^images/,
          "/uploads"
        );
        formData.src = uploadedImageUrl; // mettre à jour formData.src
      }

      // Récupérer JSON complet
      const response = await axios.get(`${API_URL}/carouselImages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allCarouselImages = response.data;
      const updatedAllCarouselImages = { ...allCarouselImages };
      let slides = updatedAllCarouselImages[category] || [];

      if (isCreatingNewSlide) {
        const allSlides = Object.values(allCarouselImages).flat();
        const newId =
          allSlides.length > 0
            ? Math.max(...allSlides.map((s) => s.id)) + 1
            : 1;
        const newSlide = { ...formData, id: newId, src: uploadedImageUrl };
        slides.push(newSlide);
      } else {
        slides = slides.map((s) =>
          s.id === formData.id
            ? { ...s, ...formData, src: uploadedImageUrl }
            : s
        );
      }

      updatedAllCarouselImages[category] = slides;

      // Sauvegarde finale
      await axios.put(`${API_URL}/carouselImages`, updatedAllCarouselImages, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLocalSlides(slides);
      setEditingSlideId(null);
      setSelectedFile(null);
      setIsCreatingNewSlide(false);

      if (heroSectionRef.current)
        heroSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    } catch (error) {
      console.error("Error saving slide:", error);
    }
  };

  const getSlideUrl = (src) => {
    if (!src) return null;
    if (src.startsWith("http")) return src;
    // Ensure there's a single slash between the base and the path
    const path = src.startsWith("/") ? src : `/${src}`;
    return `${BASE_URL}${path}`;
  };

  return (
    <>
      <section
        className={`hero-section ${
          isNavbarHovered || isFaded ? "navbar-hovered" : ""
        } carousel-${category}`}
        ref={heroSectionRef}
      >
        {isEditable && (
          <div className="carousel-admin-buttons">
            <Button variant="success" size="sm" onClick={handleCreate}>
              Ajouter
            </Button>
            {localSlides.length > 0 && (
              <>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditSlideClick(localSlides[index])}
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(localSlides[index].id)}
                >
                  Supprimer
                </Button>
              </>
            )}
          </div>
        )}
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          controls
          indicators
        >
          {localSlides.length > 0 ? (
            localSlides.map((slide) => (
              <Carousel.Item key={slide.id} className="carousel-item-container">
                <LazyLoadImage
                  src={getSlideUrl(slide.src)}
                  alt={slide.alt || ""}
                  className="w-100 hero-image"
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
                  <p>
                    Aucune image. Cliquez sur "Ajouter" pour en afficher une.
                  </p>
                )}
              </div>
            </Carousel.Item>
          )}
        </Carousel>

        <div className="hero-text">
          {localSlides[index]?.title && (
            <div className="hero-title-block">
              <h1>{localSlides[index].title}</h1>
            </div>
          )}
          {localSlides[index]?.text && (
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
                <Form.Label>URL ou chemin de l’image</Form.Label>
                <Form.Control
                  type="text"
                  name="src"
                  placeholder="/uploads/photos/team/carousel/monimage.jpg"
                  value={formData.src || ""}
                  onChange={handleFormChange}
                />
                <Form.Text className="text-muted">
                  Laisse vide pour conserver l’image actuelle.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Texte alternatif (Alt)</Form.Label>
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