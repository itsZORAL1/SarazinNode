require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mainRouter = require('./routes/routes');
const db = require('./models');

// PORT definition (defaults to 3000 if not in .env)
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: function (origin, callback) {
    // Allows: No origin (CURL), Localhost, and ALL GitHub Dev Codespace subdomains
    if (!origin || 
        origin.indexOf('github.dev') !== -1 || 
        origin.indexOf('app.github.dev') !== -1 || 
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

// Apply Middlewares
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions)); // Preflight support for all routes
app.use(express.json());

// Request Logger (Essential for debugging 502/CORS issues)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

app.get('/', (req, res) => {
    res.json({
        system: "CHRONOS_TEMPORAL_ARCHIVE",
        status: "ONLINE",
        database: "CONNECTED",
        clearance_required: "LEVEL_1",
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api', mainRouter);

// Database Authentication and Startup
db.sequelize.authenticate()
    .then(() => {
        console.log('DATABASE PERSISTENCE VERIFIED: Connected to SarazinNode_dev.');
    })
    .catch(err => {
        console.error('CRITICAL ERROR: Database link failed!', err.message);
        // We keep the server alive so the Codespace Port stays open for the UI
    });

// Binding to 0.0.0.0 is mandatory for Docker/Codespaces routing
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SYSTEM LIVE ON PORT ${PORT}`);
    console.log(`CHRONOS_API_READY: Link established.`);
});