const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

// Get feedback for destination
router.get('/', async (req, res) => {
  try {
    const { destinationId } = req.query;
    const feedback = await Feedback.find({ destinationId }).populate('userId', 'name');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { userId, destinationId, rating, comment, visitDate } = req.body;

    // Simple sentiment analysis
    let sentiment = 'neutral';
    if (rating >= 4) sentiment = 'positive';
    else if (rating <= 2) sentiment = 'negative';

    const feedback = new Feedback({
      userId,
      destinationId,
      rating,
      comment,
      sentiment,
      visitDate
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

// Get feedback statistics for destination
router.get('/stats/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    
    const stats = await Feedback.aggregate([
      { $match: { destinationId: mongoose.Types.ObjectId(destinationId) } },
      {
        $group: {
          _id: '$destinationId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          positiveReviews: {
            $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] }
          },
          negativeReviews: {
            $sum: { $cond: [{ $lte: ['$rating', 2] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      averageRating: 0,
      totalReviews: 0,
      positiveReviews: 0,
      negativeReviews: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback stats', error: error.message });
  }
});

module.exports = router;