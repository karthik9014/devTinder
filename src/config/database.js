const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://pvpvkartheek99:JCKwIC3DyCuLWfnc@cluster-pvk.wgrv4.mongodb.net/devTinder');
};

module.exports = connectDB;
