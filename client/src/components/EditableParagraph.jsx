import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function EditableParagraph({ textId, defaultText, endpoint = "pageParagraphs" }) {
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(defaultText);
  const [editedText, setEditedText] = useState(defaultText);

  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/${endpoint}/${textId}`);
        setText(response.data.content);
        setEditedText(response.data.content);
      } catch (error) {
        console.error("Error fetching text:", error);
      }
    };
    if (textId !== undefined) {
      fetchText();
    }
  }, [textId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/${endpoint}/${textId}`,
        { content: editedText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setText(editedText);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating text:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedText(text);
  };

  return (
    <>
      {isAuthenticated && isEditing ? (
        <>
          <textarea
            className="form-control"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows="10"
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
          {text}
        </p>
      )}
    </>
  );
}
