const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route');
const profileRouter = require('./routes/profile.route');
const requestRouter = require('./routes/request.route');
const userRouter = require('./routes/user.route');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware')

const app = express();
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

// Error Handling
app.use(errorHandler);

connectDB()
    .then(() => {
        console.log('Connected to Database Successfully!!');
        app.listen(7777, () => {
            console.log('Server is running on port 7777');
        });
    })
    .catch(() => {
        console.log('Error connecting to Database');
    });
