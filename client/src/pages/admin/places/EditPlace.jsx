import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState({
    title: "",
    subtitle: "",
    image: "", // Changed from photo to image
    alt: "",
    article: "",
    contacts: "", // Will be comma-separated string
    links: "", // Will be JSON string or comma-separated URLs
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/places/${id}`);
        const fetchedPlace = response.data;
        setPlace({
          id: fetchedPlace.id,
          title: fetchedPlace.title || "",
          subtitle: fetchedPlace.subtitle || "",
          image: fetchedPlace.image || "", // Explicitly use 'image'
          alt: fetchedPlace.alt || "",
          article: fetchedPlace.article || "",
          contacts: fetchedPlace.contacts
            ? fetchedPlace.contacts.join(", ")
            : "",
          links: fetchedPlace.links ? JSON.stringify(fetchedPlace.links) : "",
        });
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };
    fetchPlace();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevPlace) => ({
      ...prevPlace,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", place.title);
    formData.append("subtitle", place.subtitle);
    formData.append("alt", place.alt);
    formData.append("article", place.article);
    formData.append(
      "contacts",
      JSON.stringify(place.contacts.split(",").map((c) => c.trim()))
    ); // Convert back to array
    formData.append("links", place.links); // Send as JSON string, server will parse

    if (file) {
      formData.append("image", file); // Assuming 'image' is the field name for file uploads
    } else if (place.image) { // Changed from place.photo to place.image
      formData.append("image", place.image); // If no new file, send existing image path under 'image' key
    }

    try {
      await axios.put(`http://localhost:3001/places/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/admin/places"); // Navigate to a new admin places list page
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  return (
    <div className="edit-place-container">
      <h2>Edit Place</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={place.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Subtitle:</label>
          <input
            type="text"
            name="subtitle"
            value={place.subtitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Alt Text:</label>
          <input
            type="text"
            name="alt"
            value={place.alt}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Article:</label>
          <textarea
            name="article"
            value={place.article}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contacts (comma-separated):</label>
          <textarea
            name="contacts"
            value={place.contacts}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Links (JSON array of {`{text: '', url: ''}`}):</label>
          <textarea name="links" value={place.links} onChange={handleChange} />
          <small>
            Example: [{`{ "text": "Link 1", "url": "/link1" }`},{" "}
            {`{ "text": "Link 2", "url": "/link2" }`}]
          </small>
        </div>
        <div className="form-group">
          <label>Current Photo:</label>
          {place.image && ( // Changed from place.photo to place.image
            <img
              src={`http://localhost:3001${place.image}`}
              alt={place.alt}
              width="100"
            />
          )}
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Update Place</button>
      </form>
    </div>
  );
};

export default EditPlace;
