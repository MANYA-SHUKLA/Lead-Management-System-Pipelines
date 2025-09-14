const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://lead-management-system-pipelines.vercel.app', 
    'https://lead-management-system-pipelines.vercel.app' 
  ],
  credentials: true
}));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leadmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});


const leadsRouter = require('./routes/leads');
app.use('/api/leads', leadsRouter);


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Lead Management API' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
