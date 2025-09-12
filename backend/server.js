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

// ---------- Production Setup ----------
if (process.env.NODE_ENV === 'production') {
  // Serve frontend build
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Catch-all route for React Router
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// ---------- Default API route ----------
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Lead Management API' });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
