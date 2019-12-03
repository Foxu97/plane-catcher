export {}; // fix for 'cannot redeclare block-scoped variable'
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const validation = require('../middleware/validation');

// router.post('/login', userController.login);

router.post('/register',validation.registrationValidation, userController.register);

module.exports = router;