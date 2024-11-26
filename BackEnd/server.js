const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const MongoConnect = require('../BackEnd/DB/MongoConnect'); // Import MongoConnect Singleton
const userRoutes = require('../BackEnd/Routes/User'); // Import User routes
const ProductRoutes = require('../BackEnd/Routes/Product');
const CartRoutes = require('../BackEnd/Routes/orders');
const NoticationRoutes = require('../BackEnd/Routes/Notification');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xssClean());

console.log('JWT_SECRET:', process.env.JWT_SECRET);

app.get('/', (req, res) => {
    res.send('test');
});

// Define your MongoDB connection URL and server port
const URL = process.env.MONGO_URL || 'mongodb://localhost:27017/E-Shop'; // Use MONGO_URL from .env or default to local URL
const PORT = process.env.PORT || 3400;

// Add routes
app.use('/user', userRoutes);
app.use('/product', ProductRoutes);
app.use('/cart', CartRoutes);
app.use('/notifications', NoticationRoutes);

// Start function using MongoConnect Singleton
const start = async () => {
    try {
        const dbInstance = MongoConnect.getInstance(); // Get the singleton instance
        await dbInstance.connect(URL); // Connect to MongoDB using the Singleton
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to the database or starting the server:', error);
    }
};

start();
