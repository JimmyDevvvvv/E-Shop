const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    username: { type: String, unique: true, sparse: true },
    shoppingCart: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            quantity: { type: Number, default: 1, min: 1 },
            price: Number,
        },
    ],
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
