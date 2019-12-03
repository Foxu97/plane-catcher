const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator/check');
const User = require('../models/user');

exports.register= (req: any, res: any, next: any) => {
    const errors: any = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failded.');
        error.statusCode = 400;
        error.data = errors.array();
        res.status(422).json({ message: "Something went wrong", error: error });
        // throw error;
    }
    const email: String = req.body.email;
    const password: String = req.body.password;

    bcrypt
    .hash(password, 12)
    .then((hashedPassword: String) => {
        const user = new User({
            email: email,
            password: hashedPassword
        });
        return user.save();
    })
    .then((result: any) => {
        res.status(201).json({ message: "User created successfully." });
    })
    .catch((err: any) => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        res.status(422).json({ message: "Something went wrong", error: err });
        next(err)
    });
};