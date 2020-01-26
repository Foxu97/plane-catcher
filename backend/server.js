const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router()
const dotenv = require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const PORT = process.env.PORT || 8081;

const planeRoutes = require('./routes/plane');
const userRoutes = require('./routes/user');
const debugRoutes = require('./routes/debug');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

    
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/api/v1', router);
    
    app.use('/user', userRoutes);
    app.use('/plane', planeRoutes);
    app.use('/debug', debugRoutes);
    
    app.use('/', (req, res, next) => {
      return res.send("Backend works! :)");
    })

mongoose.connect(
  dbConfig.url, dbConfig.options
).then( result => {
  app.listen(PORT, () => {
    console.log(`Listening server on port ${PORT}`);
  });
}).catch( err => console.log(err));