const express = require("express");
const router = express.Router();
const { UserAuth } = require("../middlewares/auth");
const { validateEditedData } = require("../utils/validation");
const bcrypt = require("bcrypt");

// GET profile api using cookie
router.get("/profile/view" , UserAuth, async (req, res) => {
    try{
        const user = req.user;
        if(!user || !user.firstName){
            throw new Error("User not found");
        }
        res.send(user);
    }catch(err){ 
        res.status(500).send("Error : " + err.message);
    }
});

// PATCH update profile API
router.patch("/profile/update", UserAuth, async (req, res) => {
    try {
        const validationResult = validateEditedData(req);
        if(!validationResult){
            throw new Error("" + validationResult.message);
        }

        const user = req.user; // User from the authentication middleware
        const update_data = req.body;
        
        // Update the user fields manually
        Object.keys(update_data).forEach((key) => {
            user[key] = update_data[key];
        });

        // Save the updated user
        const updatedUser = await user.save();
        // send the user data in json format 
        res.json({
            message: `${updatedUser.firstName}, updated successfully`,
            user: updatedUser
        });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// PATCH update password
router.patch("/profile/updatePassword", UserAuth, async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;
        if(!oldPassword || !newPassword) {
            throw new Error("Old and new passwords are required");
        }
        if(newPassword === oldPassword) {
            throw new Error("Old and new passwords cannot be the same");
        }

        const isPassValid = await user.validatePassword(oldPassword);
        if (!isPassValid) {
            throw new Error("Old password is not valid");
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update the user's password
        user.password = hashedPassword;
        await user.save();
        res.json({
            message: "Password updated successfully",
        });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

module.exports = router;