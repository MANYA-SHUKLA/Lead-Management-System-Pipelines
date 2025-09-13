const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const leadsRouter = require('./routes/leads');
app.use('/api/leads', leadsRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leadmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Lead Management API' });
});

// Your API routes
app.use('/api/leads', leadsRouter);

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
