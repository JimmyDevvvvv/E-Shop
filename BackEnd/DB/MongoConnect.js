const mongoose = require('mongoose');



const connectDB = (url) => {
    return mongoose
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Connected to the database');
        })
        .catch((e) => {
            console.error('Error connecting to the database:', e.message);
        });
};



module.exports = connectDB;