const { body } = require('express-validator');
const User = require('../models/User');

exports.registrationValidation = [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom(value => {
        return User.findOne({email: value}).then(userDoc => {
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
