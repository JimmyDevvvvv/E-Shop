const express = require('express')
const router = express.Router()
const {  createProduct, updateProduct, deleteProduct,searchProducts } = require('../controllers/product')
const { authenticateToken ,authorizeAdmin}= require('../MiddleWare/Authentication_Handler');
// admin priv8
router.post('/',authenticateToken, createProduct)

// admin priv8
router.put('/:productId',authenticateToken, updateProduct)

router.delete('/:productId',authenticateToken, deleteProduct)

router.get("/search",searchProducts)

module.exports = router