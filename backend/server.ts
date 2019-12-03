import express = require('express');
const app: express.Application = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router()
const dotenv = require('dotenv').config();
const dbConfig = require('./config/dbConfig');

const planeRoutes = require('./routes/plane');
const userRoutes = require('./routes/user');


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


mongoose.connect(
  dbConfig.url, dbConfig.options
).then(( result:any ) => {
  app.listen(8080, "0.0.0.0");
  console.log("Listening server on port 8080");
}).catch(( err:any ) => console.log(err));