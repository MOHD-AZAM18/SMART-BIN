const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config');
const { PythonShell } = require('python-shell');

// Routes
const binsRouter = require('./routes/bins');
const routeRouter = require('./routes/route');
const complaintRouter = require('./routes/complaints');
const predictiveRouter = require('./routes/predictiveRoute'); // <--- UPDATED: Import new route


const app = express();

// Updated CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB: SmartSweep'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// API Routes
app.use('/api/bins', binsRouter);
app.use('/api/route', routeRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/intelligence', predictiveRouter); // <--- UPDATED: Mount the fresh Intelligence Hub route

// Root Route
app.get('/', (req, res) => res.send('Smart Waste Backend Running with ML Integration'));

// Start Server
app.listen(config.PORT, () => {
  console.log(`🚀 Backend running on port ${config.PORT}`);
  console.log(`🤖 ML Batch Endpoint: http://localhost:${config.PORT}/api/intelligence/process-intelligence`);
});