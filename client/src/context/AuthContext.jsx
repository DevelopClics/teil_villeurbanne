import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isServerOnline, setIsServerOnline] = useState(true);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
      console.log("Server status check response:", response);
      if (response.ok) {
        setIsServerOnline(true);
      } else {
        setIsServerOnline(false);
      }
    } catch (error) {
      console.error("Server status check error:", error);
      setIsServerOnline(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (id, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        setToken(token);
        setIsServerOnline(true); // Server is online if login is successful
        return true;
      } else {
        setToken(null);
        checkServerStatus(); // Check if the server is down
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setToken(null);
      setIsServerOnline(false); // Server is likely down
      return false;
    }
  };

  const logout = () => {
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, isServerOnline }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
