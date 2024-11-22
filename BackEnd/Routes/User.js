const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/User');
const {authenticateToken,authorizeAdmin} =  require('../MiddleWare/Authentication_Handler');
// Define the login route
router.post('/login', login);


 router.post('/register', register);

module.exports = router;