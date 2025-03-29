const express = require('express');
const connectDB = require('./config/database');
const UserModel = require('./models/user')
const app = express();

app.post("/signup", async (req, res) => {
    const userObj = { firstName: "venkata kartheek", lastName: "pagolu", emailId: "pvpvk@pvk.com", age: 20 }
    const user = new UserModel(userObj);
    try {
        await user.save();
        res.send('User Added Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(400).send('User Failed to Add');
    }

})

connectDB().then((res) => {
    console.log('DB connection Succesful' + res);
    app.listen(7000, () => console.log("Running in 7000"));
}).catch((err) => {
    console.log(err);
})
