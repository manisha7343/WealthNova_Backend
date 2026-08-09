const { body , validationResult} = require("express-validator")

//fullName, userName, email, password
const registationValidationRules = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required!')
        .bail()
        .isString().withMessage("Full name must contain only string!")
        .bail()
        .isLength({ min:2, max:40}).withMessage('Full name must be between 2 and 40 characters.')
        .bail()
        .matches(/^[A-Za-z ]+$/).withMessage("Full name can contain only letters and spaces")
    ,

    body('userName')
        .trim()
        .notEmpty().withMessage('Username is required!')
        .bail()
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can contain only letters, numbers, and underscore")
        .bail()
        .isLength({ min:2, max:30}).withMessage('UserName must be between 2 and 30 charachters!')
        .toLowerCase()
        
    ,
    
    body('email')
        .trim()
        .notEmpty().withMessage("Email is required!")
        .bail()
        .isEmail().withMessage("Invalid Email!")
        
    ,

    body('password')
        .notEmpty().withMessage("Password is required!")
        .bail()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage(
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character."
    ),
    
         body('country')
        .trim()
        .isString().withMessage('Country is required!')
        .bail()
        .matches(/^[A-Za-z]+$/).withMessage('County must contain only letters')
        .bail()
        .isLength({ min:2, max:14}).withMessage('lastName must be a string')
                
]

//email password
const loginValidationRules = [
     body('login')
        .trim()
        .notEmpty().withMessage("Email or username is required!")
        .toLowerCase()

]

const validate = ( req, res, next ) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            errors:errors.array().map(error => error.msg)
        })
    }

    next();
}

module.exports = {
    registationValidation:[ ...registationValidationRules, validate],
    loginValidation:[ ...loginValidationRules, validate],
}