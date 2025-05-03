const validator = require('validator');
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const validateSignup = (req) => {
    const { firstName, lastName, emailId, password} = req.body;
    
    if(!firstName || !lastName){
        throw new Error("First name and last name are required");
    } else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
};

const validateLogin = (req) => {
    const { emailId, password } = req.body;
    
    if(!emailId || !password){
        throw new Error("Email and password are required");
    } else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
};

const validateEditedData = (req) => {

    const edited_data = req.body;
    // Check if the request body is empty
    if (!edited_data || Object.keys(edited_data).length === 0) {
        return res.status(400).send("No update data provided");
    }
    const ALLOWED_CHANGES = ["firstName", "lastName", "photoUrl", "about", "skills"];
    const isValidUpdate = Object.keys(edited_data).every((key) => ALLOWED_CHANGES.includes(key));
    if (!isValidUpdate) {
        throw new Error("Invalid update data");
    }
    // Add more validation logic as needed
    // For example, you can check if the photoUrl is a valid URL
    if (edited_data.photoUrl && !validator.isURL(edited_data.photoUrl)) {
        throw new Error("Photo URL is not valid");
    }

    // allow only 5 skills
    if (edited_data.skills && edited_data.skills.length > 5) {
        throw new Error("You can only add up to 5 skills");
    }

    // Check if the about field is too long
    if (edited_data.about && edited_data.about.length > 500) {
        throw new Error("About section is too long");
    }
    return true;
}
    
const validateRequest = async (req) => {
    const { status } = req.params;
    const { toUserId } = req.params;
    const fromUserId = req.user._id;

    if (fromUserId === toUserId) {
        throw new Error("You cannot send a request to yourself");
    }
    if (!toUserId) {
        throw new Error("User ID is required");
    }
    if (!["ignored", "interested"].includes(status)) {
        throw new Error("Invalid status");
    }

    const validToUserId = await User.findById(toUserId);
    if(!validToUserId){
        throw new Error("User not found");
    }

    const isConnectionExistAlready = await ConnectionRequest.findOne({
        $or:[
            {fromUserId : fromUserId, toUserId : toUserId}, 
            {fromUserId : toUserId, toUserId : fromUserId},
        ]
    });

    if(isConnectionExistAlready){
        throw new Error("Connection request already exists");
    }
    return true;
};

const validateRequestReview = async (req) => {
    
}

module.exports = {
    validateSignup,
    validateLogin,
    validateEditedData,
    validateRequest,
}
