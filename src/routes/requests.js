const express = require("express");
const router = express.Router();
const { UserAuth } = require("../middlewares/auth");
const User = require("../models/user");

// POST sendTheConnection request 
router.post("/sendConnectionRequest", UserAuth, async (req,res) => {
    try{
        const user = req.user;
        const { connectionId } = req.body;

        const connectionUser = await User.findById(connectionId);
        if(!connectionUser || !connectionUser.firstName){
            throw new Error("Connection user not found");
        }
        res.send(user.firstName + " sent connection request to "+ connectionUser.firstName);
    } catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = router;