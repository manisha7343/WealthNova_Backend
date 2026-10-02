const { body, validationResult} = require("express-validator");

//-------------------- UpdateUserValidationRules ------------------------
const UpdateUserValidationRules = [
  body('fullName')
        .optional()
        .trim()
        .notEmpty().withMessage('Full name is required!')
        .bail()
        .isString().withMessage("Full name must contain only string!")
        .bail()
        .isLength({ min:2, max:40}).withMessage('Full name must be between 2 and 40 characters.')
        .bail()
        .matches(/^[A-Za-z ]+$/).withMessage("Full name can contain only letters and spaces")
    ,
    body('country')
        .optional()
        .trim()
        .isString().withMessage('Country must be a valid string!')
        .bail()
        .matches(/^[A-Za-z ]+$/).withMessage('Country must contain only letters and spaces')
        .bail()
        .isLength({ min:2, max:50}).withMessage('Country must be between 2 and 50 characters')
        
    

]

//-------------- ChangePasswordValidationRules ------------------------
const ChangePasswordValidationRules = [
    body('oldPassword')
        .notEmpty().withMessage("Please enter your old password!")
        
    ,
    body('newPassword')
        .notEmpty().withMessage("please enter  you new password")
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
        )
]

const validate =  (req, res, next) =>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            errors : errors.array().map(err => err.msg)
        })
    }

    next();

}

module.exports = {

 UpdateUserValdation:  [...UpdateUserValidationRules, validate],
 ChangePasswordValidationRules: [...ChangePasswordValidationRules, validate]

}
