require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mainRouter = require('./routes/routes');
const db = require('./models');
const path = require('path');


const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: function (origin, callback) {
   
    if (!origin || 
        origin.indexOf('github.dev') !== -1 || 
        origin.indexOf('app.github.dev') !== -1 || 
        origin.indexOf('onrender.com') !== -1 ||
        origin.indexOf('localhost') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

app.use(express.json());


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});
/*
app.get('/', (req, res) => {
    res.json({
        system: "CHRONOS_TEMPORAL_ARCHIVE",
        status: "ONLINE",
        database: "CONNECTED",
        clearance_required: "LEVEL_1",
        timestamp: new Date().toISOString()
    });
});*/

app.use('/api', mainRouter);



app.use(express.static(path.join(__dirname, 'insa-react/build')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'insa-react/build', 'index.html'));
});

db.sequelize.authenticate()
    .then(() => {
        console.log('DATABASE PERSISTENCE VERIFIED: Connected to SarazinNode_dev.');
    })
    .catch(err => {
        console.error('CRITICAL ERROR: Database link failed!', err.message);
        
    });


app.listen(PORT, '0.0.0.0', () => {
    console.log(`SYSTEM LIVE ON PORT ${PORT}`);
    console.log(`CHRONOS_API_READY: Link established.`);
});