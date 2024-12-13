const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { login, register } = require('../Controllers/User');
const User = require('../Models/User');

const app = express();
app.use(express.json());
app.post('/login', login);
app.post('/register', register);

describe('User Controller', () => {
    beforeAll(async () => {
        // Connect to a test database. You can also use mongodb-memory-server for in-memory tests
        const url = `mongodb://127.0.0.1/user_test_db`;
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        // Disconnect from the test database
        await mongoose.connection.close();
    });

    // Optionally clear the database before each test to ensure test isolation
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /login', () => {
        it('should return 200 and a token for valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 13);
            const user = new User({
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                role: 'customer',
            });
            await user.save();

            const res = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('role', 'customer');
        });

        it('should return 401 for invalid credentials', async () => {
            // No user created or user with different credentials
            const res = await request(app)
                .post('/login')
                .send({ email: 'wrong@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('msg', 'Invalid email or password');
        });
    });

    describe('POST /register', () => {
        it('should return 201 for successful registration', async () => {
            const res = await request(app)
                .post('/register')
                .send({ name: 'New User', email: 'newuser@example.com', password: 'password123' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('msg', 'User registered successfully');
        });

        it('should return 400 for missing fields', async () => {
            const res = await request(app)
                .post('/register')
                .send({ email: 'newuser@example.com', password: 'password123' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('msg', 'Name, email, and password are required');
        });

        it('should return 400 for invalid email format', async () => {
            const res = await request(app)
                .post('/register')
                .send({ name: 'New User', email: 'invalidemail', password: 'password123' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('msg', 'Invalid email format');
        });

        it('should return 400 for duplicate email', async () => {
            const hashedPassword = await bcrypt.hash('password123', 13);
            const user = new User({
                name: 'Test User',
                email: 'duplicate@example.com',
                password: hashedPassword,
                role: 'customer',
            });
            await user.save();

            const res = await request(app)
                .post('/register')
                .send({ name: 'New User', email: 'duplicate@example.com', password: 'password123' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('msg', 'Email already exists');
        });
    });
});
