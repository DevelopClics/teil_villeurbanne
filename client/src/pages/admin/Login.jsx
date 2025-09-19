import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const success = await login(id.trim(), password.trim());
      if (success) {
        navigate("/");
      } else {
        setError("Identifiants invalides");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "480px" }}>
      <h2 className="text-center mb-4">
        Se connecter <br /> au back office
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="id" className="form-label">
            Identifiant
          </label>
          <input
            id="id"
            type="text"
            className="form-control"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="d-grid">
          <button type="submit" className="btn btn-main-blue">
            Connexion
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
