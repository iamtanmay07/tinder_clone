const express = require('express');
// connect the database
require("./config/database"); 
const app = express();
const User = require("./models/user");

// needed JSON parsing middleware
app.use(express.json());

// signup the user using POST API
app.post("/signup", async (req, res) => {
    
    // const userObj ={
    //     firstName: req.body.firstName || "Tanmay",
    //     lastName: req.body.lastName || "Patel",
    //     emailId: req.body.emailId || "tanmay9248@gmail.com",
    //     password: req.body.password || "password",
    // }

    const userObj = req.body; // destructure the data from the request body

    // creating instance of User model 
    // always use try-catch block to handle errors
    try{
        const user = new User(userObj);
        await user.save(); // this will return you a promise 
        res.send("User signed up");
        console.log("User signed up log");
    } catch(err){
        console.error(err);
        res.status(500).send("Error signing up user");
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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {
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

