const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    emailId:{
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        // trim white space 
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong");
            }
        }
    },
    age: {
        type: Number,
        min : 18,
    },
    gender :{
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl :{
        type : String,
        default : "https://www.w3schools.com/howto/img_avatar.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not valid");
            }
        }
    },
    skills: {
        type: [String],
    }, 
    about :{
        type : String,
        default : "This is deafault about the user!",
        MaxLength : 100,
    }
}, {
    timestamps: true,
})

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ id : user._id }, "ThisSecretKeyIsJustForExample", {
        expiresIn : process.env.JWT_EXPIRES_IN,
    });

    return token;
}

userSchema.methods.validatePassword = async function(passwordByInput){
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordByInput, user.password);
    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);