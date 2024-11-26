import React, { useState, useEffect } from "react";
import "./Cart.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]); // State to store cart items
    const [loading, setLoading] = useState(true); // State to show a loading spinner
    const [error, setError] = useState(null); // State to handle errors

    // Fetch cart items on component mount
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem("token"); // Get user token
                if (!token) {
                    setError("You must be logged in to view your cart.");
                    setLoading(false);
                    return;
                }

                const response = await fetch("http://localhost:7777/cart", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Include token in headers
                    },
                });

                if (!response.ok) {
                    const { msg } = await response.json();
                    setError(msg || "Failed to fetch cart items.");
                } else {
                    const data = await response.json();
                    setCartItems(data.cartDetail || []); // Update state with cart items
                }
            } catch (err) {
                console.error("Error fetching cart items:", err);
                setError("Internal server error. Please try again later.");
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchCartItems();
    }, []);

    // Render loading state
    if (loading) {
        return <div className="cart__loading">Loading your cart...</div>;
    }

    // Render error state
    if (error) {
        return <div className="cart__error">{error}</div>;
    }

    // Render cart items
    return (
        <div className="cart">
            <h1>Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart__items">
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart__item">
                            <h3>{item.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <button
                                className="cart__removeButton"
                                onClick={() => removeItem(item.productId)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Function to handle removing an item
    async function removeItem(productId) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:7777/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                const { msg } = await response.json();
                alert(msg || "Failed to remove item.");
                return;
            }

            // Filter out the removed item from state
            setCartItems(cartItems.filter((item) => item.productId !== productId));
        } catch (err) {
            console.error("Error removing item:", err);
            alert("Internal server error. Please try again later.");
        }
    }
};
export default Cart;
