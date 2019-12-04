const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const validation = require('../middleware/validation');

router.post('/login', userController.postLoginUser);

router.post('/register', validation.registrationValidation, userController.postRegisterUser);

module.exports = router;