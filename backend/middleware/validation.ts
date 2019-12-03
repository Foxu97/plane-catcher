export {}; // fix for 'cannot redeclare block-scoped variable'
const { body } = require('express-validator/check');
const User = require('../models/user');

exports.registrationValidation = [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value: any) => {
        return User.findOne({email: value}).then((userDoc: any) => {
            if(userDoc){
                return Promise.reject('E-Mail address already exists!');
            }
        });
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/)
    .withMessage('Passowrd has to contain at least 1 special character, 1 number, 1 lower and 1 upper case character and be of lenght of not lower than 8'),
]
