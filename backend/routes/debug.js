const express = require('express');
const router = express.Router();
const debugController = require('../controllers/debug');

router.post('/consolelog', debugController.consolelog);

module.exports = router;