const validator = require('validator');

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

module.exports = {
    validateSignup,
    validateLogin,
}
