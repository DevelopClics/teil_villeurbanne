import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function EditableTitle({ textId, defaultTitle }) {
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [editedTitle, setEditedTitle] = useState(defaultTitle);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const headers = {};
        if (isAuthenticated) {
          const token = localStorage.getItem("token");
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }
        const response = await axios.get(
          `http://localhost:3001/pageTitles/${textId}`,
          { headers }
        );
        setTitle(response.data.content);
        setEditedTitle(response.data.content);
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };
    if (textId !== undefined) {
      fetchTitle();
    }
  }, [textId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/pageTitles/${textId}`,
        { content: editedTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle(editedTitle);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  return (
    <>
      {isAuthenticated && isEditing ? (
        <>
          <input
            type="text"
            className="form-control"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <button className="btn btn-success mt-2" onClick={handleSaveClick}>
            Enregistrer
          </button>
          <button
            className="btn btn-secondary mt-2 ms-2"
            onClick={handleCancelClick}
          >
            Annuler
          </button>
        </>
      ) : (
        <h2>
          {isAuthenticated && (
            <button className="btn btn-warning me-1" onClick={handleEditClick}>
              Modifier le titre
            </button>
          )}
          {title}
        </h2>
      )}
    </>
  );
}
