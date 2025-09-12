const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single lead by ID
router.get('/:id', getLead, (req, res) => {
  res.json(res.lead);
});

// CREATE a new lead
router.post('/', async (req, res) => {
  const lead = new Lead({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    company: req.body.company,
    status: req.body.status,
    notes: req.body.notes,
    source: req.body.source
  });

  try {
    const newLead = await lead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a lead
router.patch('/:id', getLead, async (req, res) => {
  if (req.body.name != null) {
    res.lead.name = req.body.name;
  }
  if (req.body.email != null) {
    res.lead.email = req.body.email;
  }
  if (req.body.phone != null) {
    res.lead.phone = req.body.phone;
  }
  if (req.body.company != null) {
    res.lead.company = req.body.company;
  }
  if (req.body.status != null) {
    res.lead.status = req.body.status;
  }
  if (req.body.notes != null) {
    res.lead.notes = req.body.notes;
  }
  if (req.body.source != null) {
    res.lead.source = req.body.source;
  }

  try {
    const updatedLead = await res.lead.save();
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a lead - FIXED VERSION
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Cannot find lead' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get lead by ID
async function getLead(req, res, next) {
  let lead;
  try {
    lead = await Lead.findById(req.params.id);
    if (lead == null) {
      return res.status(404).json({ message: 'Cannot find lead' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.lead = lead;
  next();
}

module.exports = router;