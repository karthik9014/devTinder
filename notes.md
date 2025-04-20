- Creating Sample Server using express
--------------------------------------
const express = require('express');
const app = express();
app.use((req, res) => {
    if (req.url === '/home') res.status(200).send('home page');
    else if (req.url === '/about') res.status(200).send('about page');
    else res.send('Hello World!!');
});
app.listen(7777, () => {
    console.log('server is running at 7777');
});

//get user by email
app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const allUsers = await UserModel.find({ emailId: userEmail });
        res.send(allUsers);
    } catch (error) {
        res.status(500).send('Error getting user');
    }
});

app.get('/feed', async (req, res) => {
    try {
        const allUsers = await UserModel.find();
        res.send(allUsers);
    } catch (error) {
        res.status(500).send('Error getting users');
    }
});
app.get('/feedById/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const user = await UserModel.findById(req.params.id);
        res.send(user);
    } catch (error) {
        res.status(500).send('Error getting user');
    }
});

app.delete('/deleteUser/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await UserModel.findByIdAndDelete(userId);
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

app.patch('/updateUser/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userBody = req.body;
    const ALLOWED_UPDATE_FIELDS = ['password', 'age', 'gender', 'photoUrl', 'about', 'skills'];
    try {
        const isUpdateAllowed = Object.keys(userBody)?.every((k) => ALLOWED_UPDATE_FIELDS.includes(k));
        if (!isUpdateAllowed) {
            return res.status(400).send({ data: null, isSuccess: false, message: 'Invalid update fields' });
        }
        if (userBody?.skills?.length > 3) {
            return res.status(400).send({ data: null, isSuccess: false, message: 'Skills cannot be more than 3' });
        }
        const user = await UserModel.findByIdAndUpdate(userId, userBody, { returnDocument: 'before', runValidators: true });
        console.log('🚀 ~ app.patch ~ user:', user);
        res.status(200).send({ data: null, isSuccess: true, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).send({ data: null, isSuccess: false, message: 'Error updating user' });
    }
});


------------------------------------------------------
- npm init
- npm i express
- src/app.js
- Install nodemon to update the server automatically i.e., npm i -g nodemon [instead of running node src/app.js everytime]
- Order the routes matter alot

=======================================================
const express = require('express');

const app = express();

app.listen(7000, () => console.log("Running in 7000"));

app.get("/",(req, res, next) => {
    next();
})
app.get("/user",(req, res, next) => {
    res.send("User Checked Succesfully")
})

app.use("/user",(req, res, next) => {
    res.send("User GET call Succesful");
    next();
},(req, res, next) => {
    res.send("User GET call Succesful - 2"); // won't be executed(Gets error)
})

app.use("/user",(req, res, next) => {
    // res.send("User GET call Succesful - 1");
    next();
},(req, res, next) => {
    next();
    // res.send("User GET call Succesful - 2")
},(req, res, next) => {
    res.send("User GET call Succesful - 3")
});

app.use("/user",fn1,fn2,fn3);
app.use("/user",[fn1,fn2,fn3]);


==========================================================
# Routing Techniques
"/use?r" -> /usr
"/u(se)?r" -> /ur
"/u(se)+r" -> /useseseser or /user
"/use+r" -> /useeeer 
"/use*r" -> /usedskfhsdkdkfhksdhfr or /usefkjsdr
/a/ -> We can also use regular expressions for routes 
"/user/:userId/:name" -> /user/567/Karthik -> req.params => {userId:"567", name:"Karthik"} // Accessing Dynamic Routes
                      -> /user?userId=567%name=Karthik -> req.query => {userId:"567", name:"Karthik"} // Accessing Query Parameters

===========================================================
# Middleware Example
adminAuth -> function will be called for all the /admin routes
const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAuthorized = token === "xyz";
    if (isAuthorized) {
        next();
    } else {
        res.status(401).send("User Authentication Failed");
    }
}
app.use("/admin", adminAuth);

app.use("/admin/getDetails", (req, res, next) => {
    res.send("Sent details succesfully")
})

=========================================================================
# Error Handling (try-catch also can be used for individual middlewares)
app.use("/admin", (req, res, next) => {
    throw new Error("Something went wrong");
});
app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send(err.message);
    }
});
