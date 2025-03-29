const express = require('express');
// connect the database
require("./config/database"); 
const app = express();
const User = require("./models/user");


app.post("/signup", async (req, res) => {
    
    const userObj ={
        firstName: req.body.firstName || "Tanmay",
        lastName: req.body.lastName || "Patel",
        emailId: req.body.emailId || "tanmay9248@gmail.com",
        password: req.body.password || "password",
    }

    // creating instance of User model 
    // always use try-catch block to handle errors
    try{
        const user = new User(userObj);
        await user.save(); // this will return you a promise 
        res.send("User signed up");
        console.log("User signed up log");
    } catch(err){
        // console.error(err);
        res.status(500).send("Error signing up user");
    }
}); 

// GET API to fetch all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
        console.log("Fetched users log");
    } catch (error) {
        res.status(500).send("Error fetching users");
        console.error(error);
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000')
});

