import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaBell } from "react-icons/fa"; // Import Font Awesome icons
import "./Home.css";

const Home = () => {
    const [user, setUser] = useState(null); // State to store the logged-in user's details

    // Simulate fetching user data from token or API
    useEffect(() => {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        if (token) {
            const userData = parseJwt(token); // Parse JWT to get user data
            setUser(userData); // Set the user state
        }
    }, []);

    // Utility to parse JWT token (assuming payload is in base64)
    const parseJwt = (token) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            return JSON.parse(atob(base64));
        } catch (error) {
            return null;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear token from localStorage
        setUser(null); // Reset user state
        window.location.href = "/"; // Redirect to home
    };

    return (
        <div className="home">
            {/* Header */}
            <div className="header">
                <a href="/" className="header__logo">E-Shop</a>
                <div className="header__search">
                    <input type="text" className="header__searchInput" placeholder="Search products..." />
                    <button className="header__searchButton">
                        <FaSearch />
                    </button>
                </div>
                <div className="header__nav">
                    {user ? (
                        <>
                            <span className="header__welcome"></span>
                            <a href="/cart" className="header__navLink">
                                <FaShoppingCart /> Cart
                            </a>
                            <a href="/notifications" className="header__navLink">
                                <FaBell /> Notifications
                            </a>
                            <button onClick={handleLogout} className="header__navButton">Logout</button>
                        </>
                    ) : (
                        <>
                            <a href="/login" className="header__navLink">Login</a>
                            <a href="/register" className="header__navLink">Register</a>
                        </>
                    )}
                </div>
            </div>

            {/* Hero Section */}
            <div className="hero">
                <div className="hero__content">
                    <h1>Welcome to E-Shop</h1>
                    <p>Shop amazing deals on products you love!</p>
                </div>
            </div>

            {/* Categories Section */}
            <div className="categories">
                <div className="category">
                    <img
                        src="https://cdn.pixabay.com/photo/2014/04/02/10/26/laptop-304311_960_720.png"
                        alt="Electronics"
                    />
                    <h3>Electronics</h3>
                </div>
                <div className="category">
                    <img
                        src="https://cdn.pixabay.com/photo/2016/08/26/15/06/woman-1623088_960_720.jpg"
                        alt="Fashion"
                    />
                    <h3>Fashion</h3>
                </div>
                <div className="category">
                    <img
                        src="https://cdn.pixabay.com/photo/2017/07/07/09/54/kitchen-2486092_960_720.jpg"
                        alt="Home & Kitchen"
                    />
                    <h3>Home & Kitchen</h3>
                </div>
                <div className="category">
                    <img
                        src="https://cdn.pixabay.com/photo/2016/08/30/20/05/people-1634273_960_720.jpg"
                        alt="Sports & Outdoors"
                    />
                    <h3>Sports & Outdoors</h3>
                </div>
            </div>
        </div>
    );
};

export default Home;
