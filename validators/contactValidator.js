const { body, validationResult } = require('express-validator');

//---------------------------------------
const createContactValidationRules = [
  body('name')
    .trim()  
    .notEmpty().withMessage('Name is required!')
    .bail()
    .isString().withMessage("Name must be a string!")
    .bail()
    .matches(/^[A-Za-z ]+$/).withMessage('Name must contain only letters and spaces')
    .bail()
    .isLength({ min: 2, max: 14 }).withMessage('Name must be 2-14 chars!'),

    body('phone')
        .notEmpty().withMessage('Phone is required')
        .bail()
        .isInt().withMessage("phone should be a Number")
        .bail()
        .isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits')
        .bail()
        .isNumeric().withMessage('Phone must contain only numbers'),
    
    body('email')
        .notEmpty().withMessage('Email is required')
        .bail()
        .isEmail().withMessage("Invalid email format"),

    body('isFavorite')
        .optional()
        .isBoolean().withMessage("isfavorite must be a booleans value (true or fasle)"),

    body('tags')
        .optional()    // tags nahi bheja toh chalega, par bheja hai toh sahi hona chahiye
        .custom(value => {
            if (value && !Array.isArray(value) && typeof value !== 'string') {
                throw new Error('Tags must be a string or an array');
            }
            return true;
        })
];


//--------------------------------------

const updateContactVlaidationRules = [
    body('name')
        .optional()
        .isString().withMessage("name must be a string!")
        .bail()
        .matches(/^[A-Za-z ]+$/).withMessage('Name must contain only letters')
        .bail()
        .isLength({ min:2, max:14}).withMessage("Name msust be between 2-14 chars")
        .trim(),

    body('phone')
        .optional()
        .isInt().withMessage("phone must be a number")
        .bail()
        .isLength({ min: 10, max: 10}).withMessage('phone must be 10 digits')
        .bail()
        .isNumeric().withMessage('phone must contain only numbers'),

    body('email')
        .optional()
        .isEmail().withMessage('Invalid email formate'),

    body('isFavorite')
        .optional()
        .isBoolean().withMessage("isFavorite must be a boolean (true or false)")
        .toBoolean(),
    

     body('isDeleted')
        .optional()
        .isBoolean().withMessage("isDeleted must be a boolean (true or false)"),


    body('tags')
        .optional()
        .custom(value => {
            if (value && !Array.isArray(value) && typeof value !== 'string') {
                throw new Error('Tags must be a string or an array');
            }
            return true;
        })
        ,

        //if req body is empty 
        body().custom((_, { req }) => {
        if (Object.keys(req.body).length === 0) {
            throw new Error('At least one field is required to update');
        }
        return true;

})
 
]

//---------------------------------------

const validate = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Server crash nahi hoga, seedha 400 error response jayega
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => err.msg)
            });
        }
    
        next();


};



// bundled export
module.exports = {
    createContactValidation: [ createContactValidationRules, validate],
    updateContactValidation: [ ...updateContactVlaidationRules, validate]
};