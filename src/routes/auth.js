const express = require("express");
const router = express.Router();
const { validateSignup, validateLogin } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// signup the user using POST API
router.post("/signup", async (req, res) => {

    // creating instance of User model 
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
router.post("/login", async (req, res) => {

    try{
        validateLogin(req); 
        const { emailId, password } = req.body;

        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("You haven't signed up yet!");
        }

        const isPasswordValid = await user.validatePassword(password); 
        if(!isPasswordValid){
            throw new Error("Password is incorrect");
        }

        // fetch token from the user schema method
        const token = await user.getJWT();

        res.cookie("token", token, {
            expires : new Date(Date.now() + 7*24*60*60*1000), // 7 days
        });

        res.send("User logged in"); 

    } catch(err){
        console.error(err);
        res.status(500).send("Error : " + err.message); 
    }
});

// Logout API 
router.post("/logout", async (req, res) => {
    try{
        res.clearCookie("token");
        // or you can use 
        // res.cookie("token", "", {
        //     expires : new Date(Date.now()),
        // });
        res.send("User logged out");
    }catch(err){
        res.status(500).send("Error : " + err.message);
    }
});
// this logout is fine for small projects 
// but in the big companies they do clean up job in logout api 
// like removing the token from the database, removing logs and other data
module.exports = router;


