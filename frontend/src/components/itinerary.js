const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { interests, days, pace, includeNightlife, budget } = req.body;

    // Simulation of AI Itinerary Generation
    // In a real production app, you would call an AI API (like OpenAI) here.
    
    // Artificial delay to simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const locations = ['Ranchi', 'Netarhat', 'Betla National Park', 'Deoghar', 'Jamshedpur', 'Dassam Falls', 'Patratu Valley'];
    const itinerary = [];

    for (let i = 1; i <= days; i++) {
      const location = locations[(i - 1) % locations.length];
      itinerary.push({
        day: i,
        place: location,
        activity: `Explore ${location} based on your interest in ${interests.split(',')[0]}`,
        notes: `Budget: ${budget} | Pace: ${pace}${includeNightlife ? ' | Evening activities included' : ''}`
      });
    }

    res.json({
      message: `Custom ${days}-Day Itinerary for ${interests}`,
      itinerary: itinerary,
      tips: [
        'Carry sufficient cash as some remote areas might not have ATMs',
        'Respect local tribal culture and traditions',
        'Check weather conditions before visiting waterfalls'
      ]
    });
  } catch (error) {
    console.error('Error in itinerary generation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;