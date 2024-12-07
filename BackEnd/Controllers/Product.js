const Product = require('../Models/Product');
const mongoose = require('mongoose');


const createProduct = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized action' });
    }
    try {
        const { name, description, price, stock } = req.body;

        // Validation
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'Invalid product name' });
        }
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'Invalid price' });
        }
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: 'Invalid stock quantity' });
        }

        const newProduct = await Product.create({ name, description, price, stock });
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateProduct = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized action' });
    }
    try {
        const { productId } = req.params;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteProduct = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized action' });
    }
    try {
        const { productId } = req.params;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const sanitizedQuery = query.trim(); // Remove unnecessary whitespace/newlines
        console.log("Query Received:", sanitizedQuery);

        const regex = new RegExp(sanitizedQuery, 'i'); // Create a case-insensitive regex
        const queryObject = {
            $or: [
                { name: regex },
                { description: regex },
            ],
        };

        console.log("Query Object:", queryObject);

        const products = await Product.find(queryObject);
        console.log("Search Results:", products);

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json({ message: 'Products fetched successfully', products });
    } catch (error) {
        console.error('Error searching products:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {

    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
};
