import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function EditableContent({ endpoint, rows = 10 }) {
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001${endpoint}`);
        setContent(response.data.content);
        setEditedContent(response.data.content.replace(/<br\s*\/?>/gi, '\n'));
      } catch (error) {
        console.error(`Error fetching content from ${endpoint}:`, error);
      }
    };
    fetchContent();
  }, [endpoint]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const textToSave = editedContent.replace(/\n/g, '<br />');
      await axios.put(
        `http://localhost:3001${endpoint}`,
        { content: textToSave },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent(editedContent.replace(/\n/g, '<br />'));
      setIsEditing(false);
    } catch (error) {
      console.error(`Error updating content at ${endpoint}:`, error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(content.replace(/<br\s*\/?>/gi, '\n'));
  };

  return (
    <>
      {isAuthenticated && isEditing ? (
        <>
          <textarea
            className="form-control"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={rows}
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
        <p>
          {isAuthenticated && (
            <button className="btn btn-main-blue" onClick={handleEditClick}>
              Modifier le texte
            </button>
          )}
          <span dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
        </p>
      )}
    </>
  );
}