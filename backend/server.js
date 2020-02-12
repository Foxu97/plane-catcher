const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router()
const compression = require('compression');
const helmet = require('helmet')
const dotenv = require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const PORT = process.env.PORT || 8082;


const planeRoutes = require('./routes/plane');
const userRoutes = require('./routes/user');
const debugRoutes = require('./routes/debug');

app.use(compression());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
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


const getAllPlanesInRangeSOCKET =  require('./controllers/plane').getAllPlanesInRangeSOCKET;

const getPlanes = async (userLat, userLng, range, heading) => {
  data = await getAllPlanesInRangeSOCKET(userLat, userLng, range, heading);
  return data;
}

mongoose.connect(
  dbConfig.url, dbConfig.options
).then( result => {
  const server = app.listen(PORT, () => {
    console.log(`Listening server on port ${PORT}`);
  });
  const io = require('./socket').init(server);
  io.on('connection', socket => {
    console.log("userConnected")
    const intervalIDs = [];
    let intervalID;
    socket.on('getPlanesInRange', async (userLat, userLng, range, heading) => {
      console.log(heading)
      if(intervalIDs.length > 0){
        intervalIDs.forEach(id => {
          clearInterval(id);
        });
        intervalIDs.splice(0, intervalIDs.length);
      }
      intervalID = setInterval(async() => {
        const data = await getPlanes(userLat, userLng, range, heading);
        if (data.data){
          socket.emit('fetchedPlanesInRange', data)
        }
      }, 5000);
      if(intervalIDs.length > 0){
        intervalIDs.forEach(id => {
          clearInterval(id);
        });
        intervalIDs.splice(0, intervalIDs.length);
      }
      intervalIDs.push(intervalID);
    });
    socket.on('disconnect', function () {
      console.log("User disconnected")
      if (intervalIDs.length > 0){
        intervalIDs.forEach(id => {
          clearInterval(id);
        });
      }
      intervalIDs.splice(0, intervalIDs.length);
    });

  });
}).catch( err => console.log(err));