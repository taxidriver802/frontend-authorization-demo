import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/App.css";

import { setToken, getToken } from "../utils/token";
import { getUserInfo } from "../utils/api";

import * as auth from "../utils/auth";
import * as api from "../utils/api";

function App(getUserInfo) {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleRegister = ({ username, email, password, confirmPassword }) => {
    if (password === confirmPassword) {
      auth
        .register(username, password, email)
        .then(() => {
          navigate("/login", { replace: true });
        })
        .catch((err) => console.error(err));
    }
  };

  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      return;
    }

    auth
      .authorize(username, password)
      .then((data) => {
        if (data.jwt) {
          setToken(data.jwt);
          setUserData(data.user);
          setIsLoggedIn(true);
          const redirectPath =
            location.state?.from?.pathname || navigate(redirectPath);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }

    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        setIsLoggedIn(true);
        setUserData({ username, email });
        navigate("/ducks");
      })
      .catch(console.error);
  }, []);

  return (
    <Routes>
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile userData={userData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
            <div className="loginContainer">
              <Login handleLogin={handleLogin} />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
            <div className="registerContainer">
              <Register handleRegister={handleRegister} />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
