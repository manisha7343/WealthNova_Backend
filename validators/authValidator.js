const { body , validationResult} = require("express-validator")

//first_name , last_name @ , email , password
const registationValidationRules = [
    body('first_name')
        .notEmpty().withMessage('first name is required!')
        .bail()
        .matches(/^[A-Za-z ]+$/).withMessage('Name must contain only letters')
        .bail()
        .isString().withMessage("name must be a string!")
        .bail()
        .isLength({ min:2, max:14}).withMessage('first name must be at least 2 chars!')
        .trim()
    ,

    body('last_name')
        .optional()
        .matches(/^[A-Za-z]+$/).withMessage('Name must contain only letters')
        .bail()
        .isString().withMessage("last name must be a string!")
        .bail()
        .isLength({ min:2, max:14}).withMessage('last name must be at least 2 chars!')
        .trim()
    ,
    
    body('email')
        .notEmpty().withMessage("Email is required!")
        .bail()
        .isEmail().withMessage("Invalid Email!")
        .trim()
    ,
    body('password')
        .notEmpty().withMessage("password is required!")
        .bail()
        .isStrongPassword().withMessage("Password must be strong!")    
                
]

//email, otp
const vrifyEmailOtpValidationRules = [
     body('email')
        .notEmpty().withMessage("Email is required!")
        .bail()
        .isEmail().withMessage("Invalid Email!")
        .trim()
    ,
    body('otp')
        .notEmpty().withMessage("OTP is required")
        .bail()
        .isLength({ min:6, max:6 }).withMessage("invalid otp")
        .bail()
        .isNumeric().withMessage("invalid OTP")    
]

//email
const resendEmailOtpValidationRules = [
     body('email')
        .notEmpty().withMessage("Email is required!")
        .bail()
        .isEmail().withMessage("Invalid Email!")
        .trim()
    ,    
]

//email password
const loginValidationRules = [
     body('email')
        .notEmpty().withMessage("Email is required!")
        .bail()
        .isEmail().withMessage("Invalid Email!")
        .trim()
    ,
    body('password')
        .notEmpty().withMessage("password is required!")
        .bail()    
    ,

]

//email
const forgetPasswordValidationRules = [
    body('email')
        .notEmpty().withMessage("Email is required!")
        .bail()
        .isEmail().withMessage("Invalid Email!")
        .trim()
    ,

]

//email , otp, newPassword
const resetPasswordValidationRuels = [
    body('email')
        .notEmpty().withMessage("Email is required!")
        .bail()
        .isEmail().withMessage("Invalid Email!")
        .trim()
    ,
    body('otp')
        .notEmpty().withMessage("OTp is required")
        .isLength({ min:6, max:6 }).withMessage("invalid otp")
        .bail()
        .isNumeric().withMessage("invalid OTP")    
    ,
    body('newPassword')
        .notEmpty().withMessage('New password is required!')
        .bail()
        .isStrongPassword().withMessage("New password must be strong!")
]


const validate = (req, res, next ) =>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            sucess:false,
            errors:errors.array().map(error => error.msg)
        })
    }


    next();
}

module.exports = {
    registationValidation:[ ...registationValidationRules, validate],
    verifyEmailOtpValidation:[ ...vrifyEmailOtpValidationRules, validate],
    resendEmailOtpValidation:[ ...resendEmailOtpValidationRules, validate ],
    loginValidation:[ ...loginValidationRules, validate],
    forgetPasswordValidation: [ ...forgetPasswordValidationRules, validate],
    resetPasswordValidation:[ ...resetPasswordValidationRuels, validate]

}