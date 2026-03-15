const express = require('express');
const Destination = require('../models/Destination');

const router = express.Router();

// Generate itinerary
router.post('/', async (req, res) => {
  try {
    const { interests, days, pace, includeNightlife, budget } = req.body;

    // Simple AI logic to generate itinerary based on interests
    let query = {};
    if (interests) {
      const interestWords = interests.split(',').map(word => word.trim());
      query.$or = [
        { name: { $in: interestWords.map(word => new RegExp(word, 'i')) } },
        { description: { $in: interestWords.map(word => new RegExp(word, 'i')) } },
        { type: { $in: interestWords.map(word => new RegExp(word, 'i')) } }
      ];
    }

    const destinations = await Destination.find(query).limit(10);

    // Generate itinerary days
    const itinerary = [];
    for (let i = 1; i <= days && destinations.length > 0; i++) {
      const destination = destinations.shift();
      itinerary.push({
        day: i,
        place: destination.name,
        activity: `Explore ${destination.name} - ${destination.type} experience`,
        notes: pace === 'fast' ? 'Full day packed itinerary' : 'Leisurely pace with breaks'
      });
    }

    const tips = [
      'Carry water and snacks during sightseeing',
      'Wear comfortable shoes for walking',
      'Try local cuisine for authentic experience',
      'Respect local customs and traditions'
    ];

    res.json({
      message: 'Itinerary generated successfully',
      itinerary,
      tips
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating itinerary', error: error.message });
  }
});

module.exports = router;