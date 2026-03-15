const express = require('express');
const Destination = require('../models/Destination');

const router = express.Router();

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const { type, district, search } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (district) filter.district = district;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const destinations = await Destination.find(filter);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
  }
});

// Get single destination
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destination', error: error.message });
  }
});

// Create destination (admin only)
router.post('/', async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Error creating destination', error: error.message });
  }
});

// Update destination (admin only)
router.put('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Error updating destination', error: error.message });
  }
});

// Delete destination (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting destination', error: error.message });
  }
});

module.exports = router;