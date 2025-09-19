import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePlace = () => {
  const navigate = useNavigate();
  const [place, setPlace] = useState({
    title: "",
    subtitle: "",
    photo: "",
    alt: "",
    article: "",
    contacts: "", // Will be comma-separated string
    links: "", // Will be JSON string or comma-separated URLs
  });
  const [file, setFile] = useState(null);

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
    } else {
      // Handle case where no file is uploaded, maybe set a default image or leave it empty
      // For now, I'll just not append 'photo' if no file is selected.
    }

    try {
      await axios.post("http://localhost:3001/places", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/admin/places"); // Navigate to the admin places list page
    } catch (error) {
      console.error("Error creating place:", error);
    }
  };

  return (
    <div className="create-place-container">
      <h2>Create New Place</h2>
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
          <label>Photo:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Create Place</button>
      </form>
    </div>
  );
};

export default CreatePlace;
