const express = require("express");
const { UserAuth } = require("../middlewares/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// GET API for fetching requests
router.get("/user/requests/received", UserAuth, async (req, res) => {
    try{
        const user = req.user;
        if(!user){
            throw new Error("User not found");
        }
        const interestedRequests = await ConnectionRequest.find({
            toUserId: user._id,
            status: "interested",
        })
        .populate("fromUserId", "firstName lastName emailId") // Populate specific fields from User
        .populate("toUserId", "firstName lastName emailId");

        if(interestedRequests.length === 0){
            return res.status(200).json(
                {
                    message: "No connection requests found",
                    requests: [],
                }
            );
        }
        // populate the fromUserId field with user data
        res.json({
            message: "Connection requests found",
            requests: interestedRequests,
        });
    }catch(err){
        res.status(500).send("Error : " + err.message);
    }
});
    
// GET API for mutual connections 
router.get("/user/connections", UserAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        
        const connectionData = await ConnectionRequest.find({
            $or:[
                {toUserId : loggedInUser._id, status : "accepted"},
                {fromUserId : loggedInUser._id, status : "accepted"},
            ]
        })
        .populate("fromUserId", "firstName lastName age gender about")
        .populate("toUserId", "firstName lastName age gender about");


        if(!connectionData){
            res.json(
                {
                message : "you dont have any connections"
                }
            );
        }
        res.json(
            {
                message : "here is your connection list",
                data : connectionData
            }
        );
    }catch(err){
        res.status(404).send("Error "+err.message);
    }
});

// GET API for user feed
// what thing do I need 
// lets say 10 users from the db 
// we dont want to choose those users who already are rejected/connected
// so we need to check the connection request table
// when user reach the end of the 10 users list, api should call again with new users 
// and so on
router.get("/feed", UserAuth, async(req, res) => {
    try{
        const loggedInUser = req.user; 
        const page = parseInt(req.query.page) || 1;
        let limitt = parseInt(req.query.limit) || 10;
        limitt = limitt > 30 ? 30 : limitt;
        
        const num_pages = (page-1) * limitt;

        // this is array of object (not particular IDs)
        const notToShowIdsObj = await ConnectionRequest
            .find({
                $or:[
                    {fromUserId : loggedInUser._id},
                    {toUserId : loggedInUser._id},
                ]
            })
            .select("fromUserId toUserId");
        
        
        // now flattening 
        const notToShowIds = notToShowIdsObj.flatMap(r => [r.fromUserId, r.toUserId]);
        notToShowIds.push(loggedInUser._id);

        const usersOnFeed = await User.find({
            _id : {
                $nin : notToShowIds,
            }
        }).select("firstName lastName emailId photoUrl about skills").skip(num_pages).limit(limitt);
            

        
        res.json({
            "message" : "this is user feed data",
            "data" : usersOnFeed,
        });

    }catch(err){
        res.json({
            message : "Error : " + err.message,
        });
    }
});

module.exports = router;