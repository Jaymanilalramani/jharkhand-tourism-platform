const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Waterfall', 'Historical', 'Wildlife', 'Cultural', 'Religious', 'Nature']
  },
  district: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lon: Number
  },
  visitors: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  images: [String],
  entryFee: {
    indian: Number,
    foreigner: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);