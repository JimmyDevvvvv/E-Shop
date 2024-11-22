const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/User');
require('express-async-errors');

const SALT_ROUNDS = 13;

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userID: user._id, role: user.role }, // Include userID in the payload
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '2d' }
        );

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

















const register = async (req, res) => {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Name, email, and password are required' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ msg: 'Invalid email format' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            name,
            email,
            password: hash,
            role: 'customer',
            username: username || `user_${Date.now()}`, // Provide default username if none
        });

        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error("Error during user registration: ", error.message);
        if (error.code === 11000) {
            return res.status(400).json({ msg: 'Duplicate key error, please ensure all unique fields are unique' });
        }
        res.status(500).json({ msg: 'Internal server error' });
    }
};



module.exports = { login, register };