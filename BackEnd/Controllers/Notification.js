const Notification = require('../models/Notification'); // Adjust path
const User = require('../models/User');
const mongoose = require('mongoose');
// Create a Notification
exports.createNotification = async (req, res) => {
    try {
        const { title, message, type, userId } = req.body;
        const { userID, role } = req.user;

        // Ensure only admins can create notifications
        if (role !== 'admin') {
            return res.status(403).json({ msg: 'Only admins can create notifications' });
        }

        // Validate userId for private notifications
        if (type === 'private') {
            if (!userId) {
                return res.status(400).json({ msg: 'UserId is required for private notifications' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: 'User not found for private notification' });
            }
        }

        // Create the notification
        const notification = new Notification({
            title,
            message,
            type,
            userId: type === 'private' ? userId : null, // Null for public notifications
            createdBy: userID
        });

        await notification.save();

        res.status(200).json({ msg: 'Notification added successfully', notification });
    } catch (error) {
        console.error('Error adding notification:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch Notifications for a User
exports.getNotifications = async (req, res) => {
    try {
        const { userID } = req.user; // Extract userID from the authenticated token

        // Query to get public and private notifications for the current user
        const notifications = await Notification.find({
            $or: [
                { type: 'public' }, // Global notifications (for everyone)
                { type: 'private', userId: userID } // Private notifications for the logged-in user
            ]
        }).sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a Notification
exports.deleteNotification = async (req, res) =>  {
    try {
        const { notificationId } = req.params;

        if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ msg: 'Invalid or missing notification ID' });
        }

        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        res.status(200).json({ msg: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
