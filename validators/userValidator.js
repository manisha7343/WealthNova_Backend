const { body, validationResult} = require("express-validator");

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
        .isString().withMessage('Country is required!')
        .bail()
        .matches(/^[A-Za-z]+$/).withMessage('County must contain only letters')
        .bail()
        .isLength({ min:2, max:14}).withMessage('lastName must be a string')
        
    

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

 UpdateUserValdation:  [...UpdateUserValidationRules, validate]

}
