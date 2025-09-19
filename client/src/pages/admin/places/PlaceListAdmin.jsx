import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // Assuming AuthContext is needed for admin pages

const PlaceListAdmin = () => {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming authentication is required

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:3001/places");
      setPlaces(response.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        await axios.delete(`http://localhost:3001/places/${id}`);
        fetchPlaces(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting place:", error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Admin Places Management</h2>
      <div className="row mb-3">
        <div className="col">
          <Link
            className="btn btn-main-blue me-1"
            to="/admin/places/create" // Assuming a create place page will be added
            role="button"
          >
            Create New Place
          </Link>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place.id}>
                  <td>{place.id}</td>
                  <td>{place.title}</td>
                  <td>{place.subtitle}</td>
                  <td>
                    {place.photo && (
                      <img
                        src={`http://localhost:3001${place.photo}`}
                        alt={place.alt}
                        width="50"
                      />
                    )}
                  </td>
                  <td>
                    <Link
                      className="btn btn-warning btn-sm me-2"
                      to={`/admin/places/edit/${place.id}`}
                    >
                      Editer
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(place.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlaceListAdmin;
