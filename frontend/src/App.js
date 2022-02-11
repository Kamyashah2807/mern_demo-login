import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Container } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import User from "./components/User";
import Admin from "./components/Admin";


const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

  
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
     <Router>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container fluid>
            <Navbar.Brand href="/">Mern App</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">

              {showAdminBoard && (
                <div className="navbar-nav ml-auto">
                  <Link to={"/admin"} className="nav-link">
                    Admin
                  </Link>
                </div>
              )}

              {currentUser && (
                <div className="navbar-nav ml-auto">
                  <Link to={"/user"} className="nav-link">
                    User
                  </Link>
                </div>
              )}

              {currentUser ? (
                <div className="navbar-nav ml-auto">
                  <Link to={"/profile"} className="nav-link">
                    Profile
                  </Link>
                  <li className="nav-item">
                    <a href="/login" className="nav-link" onClick={logOut}>
                      Logout
                    </a>
                  </li>
                </div>
              ) : (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                      Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to={"/register"} className="nav-link">
                      Sign Up
                    </Link>
                  </li>
                </div>
              )}
            </Navbar.Collapse>
          </Container>

        </Navbar>

      <div className="container mt-3">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<User />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        </Router>
    </div>
  );
};

export default App;