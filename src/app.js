const express = require('express');
// connect the database
require("./config/database"); 
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");

// needed JSON parsing middleware
app.use(express.json());
app.use(cookieParser());

// manage the routes here 
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

// use the routers 
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// handle the errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});


