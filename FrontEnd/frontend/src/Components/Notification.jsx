import React, { useState, useEffect } from "react";
import "./notification.css";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState("");

    // Fetch notifications from the backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token"); // Get the token from localStorage

                if (!token) {
                    setError("User is not authenticated");
                    return;
                }

                const response = await fetch("http://localhost:1002/notifications/get", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in Authorization header
                    },
                });

                if (!response.ok) {
                    const { error } = await response.json();
                    setError(error || "Failed to fetch notifications");
                    return;
                }

                const { notifications } = await response.json();
                setNotifications(notifications); // Set notifications state
            } catch (err) {
                console.error("Error fetching notifications:", err.message);
                setError("Something went wrong. Please try again later.");
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="notifications">
            <h2>Your Notifications</h2>
            {error && <p className="error">{error}</p>}
            {notifications.length > 0 ? (
                <ul className="notifications__list">
                    {notifications.map((notification) => (
                        <li
                            key={notification._id}
                            className={`notification ${
                                notification.type === "public" ? "public" : "private"
                            }`}
                        >
                            <h3>{notification.title}</h3>
                            <p>{notification.message}</p>
                            <small>
                                {notification.type === "public" ? "Public" : "Private"}
                                {" - "}
                                {new Date(notification.createdAt).toLocaleString()}
                            </small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notifications to display.</p>
            )}
        </div>
    );
};

export default Notification;
