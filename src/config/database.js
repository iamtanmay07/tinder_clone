const mongoose = require('mongoose');
require('dotenv').config();

// require mongourl 
const mongoUrl = process.env.MONGODB_URI;

const connectDB = async () => {
    await mongoose.connect(mongoUrl);
};

connectDB().then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log('Error connecting to database', err);
});
