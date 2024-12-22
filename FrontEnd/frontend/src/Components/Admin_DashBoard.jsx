import React, { useState } from "react";
import "./Admin_DashBoard.css"; // Add styles for better visuals

const AdminDashboard = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    const [notification, setNotification] = useState({
        title: "",
        message: "",
        type: "public", // Default type
        userId: "", // Add userId for private notifications
    });

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: name === "price" || name === "stock" ? Number(value) : value, // Ensure numeric fields are numbers
        }));
    };

    const handleNotificationChange = (e) => {
        const { name, value } = e.target;
        setNotification((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const postProduct = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in!");
            return;
        }

        try {
            const response = await fetch("http://localhost:9821/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error Response:", errorData);
                alert(`Error: ${errorData.error || "Failed to add product"}`);
                return;
            }

            alert("Product added successfully!");
            setProduct({ name: "", description: "", price: "", stock: "" }); // Reset form fields
        } catch (error) {
            console.error("Network Error:", error.message);
            alert("An unexpected error occurred while adding the product.");
        }
    };

    const postNotification = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in!");
            return;
        }

        try {
            const response = await fetch("http://localhost:9821/notifications/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(notification),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error Response:", errorData);
                alert(`Error: ${errorData.msg || "Failed to post notification"}`);
                return;
            }

            alert("Notification posted successfully!");
            setNotification({ title: "", message: "", type: "public", userId: "" }); // Reset form fields
        } catch (error) {
            console.error("Network Error:", error.message);
            alert("An unexpected error occurred while posting the notification.");
        }
    };

    const deleteProduct = async (productId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:9821/product/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error Response:", errorData);
                alert(`Error: ${errorData.msg || "Failed to delete product"}`);
                return;
            }

            alert("Product deleted successfully!");
        } catch (error) {
            console.error("Network Error:", error.message);
            alert("An unexpected error occurred while deleting the product.");
        }
    };

    const deleteNotification = async (notificationId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:9821/notifications/delete/${notificationId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error Response:", errorData);
                alert(`Error: ${errorData.msg || "Failed to delete notification"}`);
                return;
            }

            alert("Notification deleted successfully!");
        } catch (error) {
            console.error("Network Error:", error.message);
            alert("An unexpected error occurred while deleting the notification.");
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            {/* Post Product */}
            <section>
                <h2>Post Product</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleProductChange}
                />
                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={product.description}
                    onChange={handleProductChange}
                ></textarea>
                <input
                    type="number"
                    name="price"
                    placeholder="Product Price"
                    value={product.price}
                    onChange={handleProductChange}
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock Quantity"
                    value={product.stock}
                    onChange={handleProductChange}
                />
                <button onClick={postProduct}>Add Product</button>
            </section>

            {/* Post Notification */}
            <section>
                <h2>Post Notification</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Notification Title"
                    value={notification.title}
                    onChange={handleNotificationChange}
                />
                <textarea
                    name="message"
                    placeholder="Notification Message"
                    value={notification.message}
                    onChange={handleNotificationChange}
                ></textarea>
                <select
                    name="type"
                    value={notification.type}
                    onChange={(e) => {
                        handleNotificationChange(e);
                        if (e.target.value === "public") {
                            setNotification((prev) => ({ ...prev, userId: "" })); // Clear userId for public notifications
                        }
                    }}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                {notification.type === "private" && (
                    <input
                        type="text"
                        name="userId"
                        placeholder="User ID"
                        value={notification.userId}
                        onChange={handleNotificationChange}
                    />
                )}
                <button onClick={postNotification}>Post Notification</button>
            </section>

            {/* Delete Product */}
            <section>
                <h2>Delete Product</h2>
                <input
                    type="text"
                    placeholder="Product ID"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") deleteProduct(e.target.value);
                    }}
                />
            </section>

            {/* Delete Notification */}
            <section>
                <h2>Delete Notification</h2>
                <input
                    type="text"
                    placeholder="Notification ID"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") deleteNotification(e.target.value);
                    }}
                />
            </section>
        </div>
    );
};

export default AdminDashboard;
