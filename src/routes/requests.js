const express = require("express");
const router = express.Router();
const { UserAuth } = require("../middlewares/auth");
const { validateRequest } = require("../utils/validation");

// User model
const User = require("../models/user");
// connectionReq model
const ConnectionRequest = require("../models/connectionRequest"); 

// POST send connection request, this is dynamic route
// we are making this dynamic for ignored and interested api
router.post("/request/send/:status/:toUserId", 
    UserAuth, 
    async (req,res) => {
    try{ 
        await validateRequest(req);

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        await connectionRequest.save();
        res.send("Connection request sent");
    } catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

// status can be rejected or accepted
// A -> B request then only B can accept
// so only B can edit the database 
router.post("/request/review/:status/:requestId",
    UserAuth,
    async (req,res) => {
        try{
            const loggedInUserId = req.user._id;
            const { status, requestId } = req.params;
            if(!status || !requestId){
                throw new Error("Status and requestId are required");
            }

             // check if the status is valid
             if(!["accepted", "rejected"].includes(status)){
                throw new Error("Status is invalid");
            }


            const validRequest = await ConnectionRequest.findOne({
                fromUserId : requestId,
                toUserId : loggedInUserId,
                status : "interested",
            });

            if(!validRequest){
                throw new Error("Request not found");
            }

            // check if the logged in user is the toUserId
            if(validRequest.toUserId.toString() !== loggedInUserId.toString()){
                throw new Error("You are not allowed to review this request");
            }
            
            // update the request
            validRequest.status = status;
            const data = await validRequest.save();
            
            res.json({
                message : `Request ${status} successfully`,
                data : data,
            });
        }
        catch(err){
            res.status(400).send("Error : " + err.message);
        }
    }
); 


module.exports = router;