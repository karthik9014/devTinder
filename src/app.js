const express = require('express');

const app = express();

app.listen(7000, () => console.log("Running in 7000"));

app.use("/admin", (req, res, next) => {
    throw new Error("Something went wrong");
});
app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send(err.message);
    }
});

