const { default: mongoose } = require('mongoose');
const User = require('../models/User');
const Product = require('../Models/Product');
const addToCart = async (req, res) => {
    try {
        const { title, message, type, userId } = req.body;
        const { userID, role } = req.user;

        // Check if the user is an admin
        if (role !== 'admin') {
            return res.status(403).json({ msg: 'Only admins can create notifications' });
        }

        // Validate userId for private notifications
        if (type === 'private') {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ msg: 'Invalid userId provided' });
            }

            // Ensure the user exists
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
            userId: type === 'private' ? userId : null,
            createdBy: userID
        });

        await notification.save();

        // Link notification to the user (only for private notifications)
        if (type === 'private') {
            const user = await User.findById(userId);
            user.notifications.push(notification._id);
            await user.save();
        }

        res.status(200).json({ msg: 'Notification added successfully', notification });
    } catch (error) {
        console.error('Error adding notification:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const { userID, role } = req.user;

        // Check if the user is a customer
        if (role !== 'customer') {
            return res.status(403).json({ msg: 'Only customers can remove products from the shopping cart' });
        }

        // Find the customer
        const customer = await User.findById(userID);
        if (!customer) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the cart is empty
        if (customer.shoppingCart.length === 0) {
            return res.status(400).json({ msg: 'Your cart is empty' });
        }

        // Check if the product is in the cart
        const isInCart = customer.shoppingCart.some(item => item.productId.toString() === productId);
        if (!isInCart) {
            return res.status(404).json({ msg: 'Product not found in the shopping cart' });
        }

        // Remove the product from the shopping cart
        customer.shoppingCart = customer.shoppingCart.filter(item => item.productId.toString() !== productId);
        await customer.save();

        res.status(200).json({
            msg: 'Product removed from the shopping cart successfully',
            cartDetail: customer.shoppingCart.map(item => ({
                productId: item.productId,
            })),
        });
    } catch (error) {
        console.error('Error removing product from the shopping cart:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addToCart,
    removeFromCart
};