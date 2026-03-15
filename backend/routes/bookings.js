const express = require('express');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');

const router = express.Router();

// Get all bookings for user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const bookings = await Booking.find({ userId }).populate('destinationId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { userId, destinationId, checkIn, checkOut, guests } = req.body;

    // Get destination to calculate amount
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Simple amount calculation
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const amount = days * (destination.entryFee?.indian || 100) * (guests?.adults || 1);

    const booking = new Booking({
      userId,
      destinationId,
      checkIn,
      checkOut,
      guests,
      amount
    });

    await booking.save();
    await booking.populate('destinationId');

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('destinationId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});

module.exports = router;