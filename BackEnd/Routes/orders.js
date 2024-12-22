const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart,getAllFromCart, checkout } = require('../Controllers/User_Cart');
const { authenticateToken ,authorizeAdmin}= require('../MiddleWare/Authentication_Handler');

// Add order (for customers only)
router.post('/', authenticateToken, addToCart);  //

// Delete order (for customers only)
router.delete('/', authenticateToken, removeFromCart);

router.post('/checkout', authenticateToken, checkout);

router.get('/', authenticateToken, getAllFromCart);

module.exports = router;