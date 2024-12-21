import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Notifications from "./Components/Notification";
import Admin_Dashboard from "./Components/Admin_DashBoard";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you're looking for doesn't exist.</p>
            <a href="/" style={{ color: "#ff9900", fontWeight: "bold" }}>
                Go Back to Homepage
            </a>
        </div>
    );
};

const App = () => {
    const isAuthenticated = () => {
        return !!localStorage.getItem("token"); // Check if token exists
    };

    const getUserRole = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        // Decode the JWT token to extract the user role
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const decoded = JSON.parse(atob(base64));
            return decoded.role; // Assuming the role is included in the token payload
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const ProtectedRoute = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" />;
    };

    const AdminRoute = ({ children }) => {
        const role = getUserRole();
        return role === "admin" ? children : <Navigate to="/" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cart" // Add the Cart route
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <Admin_Dashboard />
                            </AdminRoute>
                        </ProtectedRoute>
                    }
                />
                  <Route
                    path="/Checkout" // Add the Checkout route
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
