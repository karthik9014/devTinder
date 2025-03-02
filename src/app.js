const express = require('express');

const app = express();

app.listen(7000, () => console.log("Running in 7000"));

app.use("/user",(req, res) => {
    res.send("User Checked Succesfully")
})
app.delete("/user",(req, res) => {
    res.send("User DELETE call Succesful")
})
app.get("/user",(req, res) => {
    res.send("User GET call Succesful")
})
app.post("/user",(req, res) => {
    res.send("User POST call Succesful")
})


