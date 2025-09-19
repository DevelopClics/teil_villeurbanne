import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function ProductList() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Back Office</h2>
      <div className="row mb-3">
        <div className="col">
          <Link
            className="btn btn-main-blue me-1"
            to="/products/create"
            role="button"
          >
            Créer le produit
          </Link>
          <button className="btn btn-danger" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
        <div className="col"></div>
      </div>
      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Marque</th>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Visuel</th>
                <th>Créé le</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
