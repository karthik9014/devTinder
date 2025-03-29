const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/TestDB');
    console.log("sucessful")
}
// connectDB();
module.exports = connectDB;