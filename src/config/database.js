const mongoose = require('mongoose');

const connectDB = async () => {
    // return await mongoose.connect('mongodb+srv://pvpvkartheek99:b7VqSdUXcUuDAPCe@cluster-pvk.wgrv4.mongodb.net/sample_mflix');
    await mongoose.connect('mongodb://localhost:27017/TestDB');
    console.log("sucessful")
}
// connectDB();
module.exports = connectDB;