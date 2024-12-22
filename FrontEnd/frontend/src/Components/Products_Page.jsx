import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Products_Page.css";

const Product_Page = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const location = useLocation(); // Hook to get the current URL location
    const query = new URLSearchParams(location.search).get("query"); // Extract 'query' parameter

    useEffect(() => {
        if (query) {
            fetchProducts();
        }
    }, [query]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:9821/product/search?query=${query}`);
            setProducts(response.data.products);
            setError("");
        } catch (err) {
            setProducts([]);
            setError(err.response?.data?.message || "Error fetching products");
        }
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:9821/cart/",
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccessMessage(response.data.msg);
            setTimeout(() => setSuccessMessage(""), 3000); // Clear the success message after 3 seconds
        } catch (err) {
            console.error("Error adding product to cart:", err);
            setError(err.response?.data?.msg || "Failed to add product to cart");
        }
    };

    return (
        <div className="product-page">
            <h1>Search Results for: "{query}"</h1>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <div className="product-list">
                {products.map((product) => (
                    <div key={product._id} className="product-item">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p className="price">Price: ${product.price}</p>
                        <button
                            onClick={() => addToCart(product._id)}
                            className="add-to-cart-button"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Product_Page;
