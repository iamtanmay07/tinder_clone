const express = require('express');
// connect the database
require("./config/database"); 
const app = express();
const User = require("./models/user");
const { validateSignup, validateLogin } = require("./utils/validation");
const bcrypt = require("bcrypt");

// needed JSON parsing middleware
app.use(express.json());

// signup the user using POST API
app.post("/signup", async (req, res) => {

    // creating instance of User model 
    // always use try-catch block to handle errors
    try{
        // validate the data using the validation function
        validateSignup(req); 
        const { firstName, lastName, emailId, password } = req.body;
        // encrypting the password
        const passwordHash = await bcrypt.hash(password, 10);
        
        const user = new User({
            firstName, lastName, emailId, password : passwordHash,
        });

        await user.save(); // this will return you a promise 
        res.send("User signed up");
        console.log("User signed up log");
    } catch(err){
        console.error(err);
        res.status(500).send("Error : " + err.message); 
    }
}); 

// Login API 
app.post("/login", async (req, res) => {

    try{
        validateLogin(req); 
        const { emailId, password } = req.body;

        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("You haven't signed up yet!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error("Password is incorrect");
        }
        res.send("User logged in");

    } catch(err){
        console.error(err);
        res.status(500).send("Error : " + err.message); 
    }
});

// GET API to find the user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        // Fetch all users from the database
        const user = await User.find({emailId : userEmail}); 
        res.status(200).send(user); // Send the users as a JSON response
        console.log("Fetched users log");
    } catch (error) {
        res.status(500).send("Error fetching users");
        console.error(error);
    }
});

// GET API to find all the users
app.get("/feed", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        // Fetch all users from the database
        const user = await User.find(); 
        res.status(200).send(user); // Send the users as a JSON response
        console.log("Fetched users log");
    } catch (error) {
        res.status(500).send("Error fetching users");
        console.error(error);
    }
});

// DELETE API to delete the user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        // const user = await User.findOneAndDelete({_id: userId});
        const user  = await User.findByIdAndDelete(userId);

        if (!user) {
            // If no user is found, return 404
            return res.status(404).send("User not found");
        }
        res.send("user is deleted"); 
        console.log("Deletion completed");
    } catch (error) {
        res.status(500).send("Error deleting user!");
        console.error(error);
    }
});

// User update API 
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    
    try {
        const ALLOWED_CHANGES = [
            "firstName", "lastName", "photoUrl", "skills"
        ]
    
        // Check if the request body contains only allowed fields
        const isvalidUpdate = Object.keys(data).every((key) => {
            return ALLOWED_CHANGES.includes(key);
        });
    
        if(!isvalidUpdate){
            return res.status(400).send("Invalid update");
        }

        if(data?.skills){
            if(data.skills.length > 5){
                return res.status(400).send("Skills length should be less than 5");
            }
        }
        
        // Find the user by ID and update it
        const user  = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
        
        if (!user) {
            // If no user is found, return 404
            return res.status(404).send("User not found");
        }
        res.send(user); 
        console.log("updation completed");
    } catch (error) {
        res.status(500).send("Error updating the user!");
        console.error(error);
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000')
});

