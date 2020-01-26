const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const User = require('../models/User.js')


exports.postRegisterUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failded.');
        error.statusCode = 400;
        error.data = errors.array();
        return res.status(422).json({ message: "Something went wrong", error: error });
        // throw error;
    }
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPassword
        });
        await user.save();
        return res.status(201).json({ message: "User created successfully." });
    } catch (err) {
        return res.status(422).json({ message: "Something went wrong", error: err });
    }
};

exports.postLoginUser = async (req, res, next) => {

    try {
        const fetchedUser = await User.findOne({email: req.body.email });
        if(!fetchedUser) {
            return res.status(401).json({message: "Auth failed"});
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, fetchedUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({message: "Auth failed"});
        }
        const token = jwt.sign({
            email: fetchedUser.email,
            userId: fetchedUser._id
        },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return res.status(200).json({token: token, expiresIn: 3600});

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err });
    }

}