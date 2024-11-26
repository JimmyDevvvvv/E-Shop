const { default: mongoose } = require('mongoose');
const User = require('../models/User');
const Product = require('../Models/Product');
const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const { userID, role } = req.user;

        // Check if the user is a customer
        if (role !== 'customer') {
            return res.status(403).json({ msg: 'Only customers can add products to the shopping cart' });
        }

        // Fetch the user document
        const customer = await User.findOne({ _id: userID });
        if (!customer) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the product exists
        const product = await Product.findOne({ _id: productId });
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if the product is already in the cart
        const existingCartItem = customer.shoppingCart.find(
            (item) => item.productId.toString() === productId
        );

        if (existingCartItem) {
            // If the product exists, increase its quantity
            existingCartItem.quantity += 1;
        } else {
            // Add a new product to the cart
            customer.shoppingCart.push({
                productId: product._id,
                name: product.name,
                quantity: 1,
                price: product.price,
            });
        }

        // Save the updated user document
        await customer.save();

        res.status(200).json({
            msg: 'Product added to the shopping cart successfully',
            NumberOfProducts: customer.shoppingCart.length,
            cartDetail: customer.shoppingCart.map((item) => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
        });
    } catch (error) {
        console.error('Error adding product to the shopping cart:', error);
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
        let user = await User.findOne({_id:userID})
        if(user.shoppingCart.length === 0){
            return res.status(405).json({msg: `your cart is empty`, cartDetail: `${user.shoppingCart}`})
        }

        await User.findOneAndUpdate({ _id: userID },{ $pull: { shoppingCart: { productId: productId } } });
        res.status(200).json({ msg: 'Product removed from the shopping cart successfully' });
    } catch (error) {
        console.error('Error removing product from the shopping cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getAllFromCart = async (req, res) => {
    try {
        const { userID, role } = req.user;

        // Check if the user is a customer
        if (role !== 'customer') {
            return res.status(403).json({ msg: 'Only customers can view the shopping cart' });
        }

        let user = await User.findOne({ _id: userID });
        if (user.shoppingCart.length === 0) {
            return res.status(405).json({ msg: 'Your cart is empty', cartDetail: user.shoppingCart });
        }

        res.status(200).json({ cartDetail: user.shoppingCart });
    } catch (error) {
        console.error('Error fetching products from the shopping cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports = {
    addToCart,
    removeFromCart,
    getAllFromCart
};