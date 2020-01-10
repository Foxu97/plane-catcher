const express = require('express');
const router = express.Router();
const planeController = require('../controllers/plane');

router.get('/', planeController.getAllPlanesInRange);


//router.get('/terminal', planeController.findTerminalCoordinates);

module.exports = router;