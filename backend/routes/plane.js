const express = require('express');
const router = express.Router();
const planeController = require('../controllers/plane');

router.get('/', planeController.getAllPlanesInRange);

module.exports = router;