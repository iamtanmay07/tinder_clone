const jwt = require("jsonwebtoken");
const User = require("../models/user");

const UserAuth = async (req, res, next) => {
    try{
        // Read the token from the request headers
        const cookies = req.cookies;
        const { token } = cookies;
        if(!token){
            throw new Error("Token is not present");
        }

        // verify the token 
        const verifiedToken = jwt.verify(token, "ThisSecretKeyIsJustForExample");

        if(!verifiedToken){
            throw new Error("Token is not valid");
        }

        // find the user 
        const user = await User.findById(verifiedToken.id);
        if(!user){
            throw new Error("User not found");
        }

        // attaching the user to the request object
        req.user = user;

        // move to the user handler
        next();
    } catch(err){
        res.status(400).send("Error : " + err.message);
    }
};

module.exports = {
    UserAuth,
}