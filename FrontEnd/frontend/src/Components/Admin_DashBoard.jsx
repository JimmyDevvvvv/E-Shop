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
    });

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
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
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:7777/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(product),
            });
            if (response.ok) {
                alert("Product added successfully!");
                setProduct({ name: "", description: "", price: "", stock: "" });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.msg || "Failed to add product"}`);
            }
        } catch (error) {
            alert("An error occurred while posting the product.");
            console.error(error.message);
        }
    };

    const postNotification = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:7777/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(notification),
            });
            if (response.ok) {
                alert("Notification posted successfully!");
                setNotification({ title: "", message: "", type: "public" });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.msg || "Failed to post notification"}`);
            }
        } catch (error) {
            alert("An error occurred while posting the notification.");
            console.error(error.message);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:7777/products/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert("Product deleted successfully!");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.msg || "Failed to delete product"}`);
            }
        } catch (error) {
            alert("An error occurred while deleting the product.");
            console.error(error.message);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:7777/notifications/${notificationId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert("Notification deleted successfully!");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.msg || "Failed to delete notification"}`);
            }
        } catch (error) {
            alert("An error occurred while deleting the notification.");
            console.error(error.message);
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
                    onChange={handleNotificationChange}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <button onClick={postNotification}>Post Notification</button>
            </section>

            {/* Delete Product */}
            <section>
                <h2>Delete Product</h2>
                <input
                    type="text"
                    placeholder="Product ID"
                    onChange={(e) => deleteProduct(e.target.value)}
                />
            </section>

            {/* Delete Notification */}
            <section>
                <h2>Delete Notification</h2>
                <input
                    type="text"
                    placeholder="Notification ID"
                    onChange={(e) => deleteNotification(e.target.value)}
                />
            </section>
        </div>
    );
};

export default AdminDashboard;
