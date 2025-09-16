const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Lost'],
    default: 'New'
  },
  notes: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
