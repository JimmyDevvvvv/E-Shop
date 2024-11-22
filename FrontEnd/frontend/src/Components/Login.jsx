import React, { useState } from "react";
import "./login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:2003/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.msg || "Login failed");
                return;
            }

            const data = await response.json();
            setSuccess("Login successful!");
            localStorage.setItem("token", data.token); // Save the JWT token in local storage
            localStorage.setItem("role", data.role); // Save the user role
            setFormData({ email: "", password: "" });

            // Redirect or take further action based on role
            if (data.role === "admin") {
                window.location.href = "/admin"; // Redirect to admin dashboard
            } else {
                window.location.href = "/"; // Redirect to home
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="login">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit} className="login__form">
                <div className="form__group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form__group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="login__button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
