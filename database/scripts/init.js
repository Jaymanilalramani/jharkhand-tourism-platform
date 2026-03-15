const mongoose = require('mongoose');
const Destination = require('../../backend/models/Destination');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/jharkhand-tourism', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for initialization');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const initDatabase = async () => {
  await connectDB();

  // Clear existing data
  await Destination.deleteMany({});

  // Sample destinations
  const destinations = [
    {
      name: 'Hundru Falls',
      type: 'Waterfall',
      district: 'Ranchi',
      description: 'One of the most famous waterfalls in Jharkhand, perfect for nature lovers.',
      coordinates: { lat: 23.456, lon: 85.678 },
      visitors: 5243,
      rating: 4.7,
      entryFee: { indian: 50, foreigner: 200 }
    },
    {
      name: 'Baidyanath Dham',
      type: 'Religious',
      district: 'Deoghar',
      description: 'A major Jyotirlinga temple attracting lakhs of devotees every year.',
      coordinates: { lat: 24.483, lon: 86.700 },
      visitors: 7421,
      rating: 4.9,
      entryFee: { indian: 0, foreigner: 0 }
    },
    {
      name: 'Betla National Park',
      type: 'Wildlife',
      district: 'Palamu',
      description: 'Explore wildlife and nature trails in Jharkhand\'s popular reserve.',
      coordinates: { lat: 23.887, lon: 84.187 },
      visitors: 4856,
      rating: 4.8,
      entryFee: { indian: 100, foreigner: 500 }
    },
    {
      name: 'Jonha Falls',
      type: 'Waterfall',
      district: 'Ranchi',
      description: 'Also known as Gautamdhara, a beautiful waterfall surrounded by lush greenery.',
      coordinates: { lat: 23.634, lon: 85.543 },
      visitors: 3245,
      rating: 4.5,
      entryFee: { indian: 40, foreigner: 150 }
    },
    {
      name: 'Patratu Valley',
      type: 'Nature',
      district: 'Ramgarh',
      description: 'Scenic valley with winding roads and beautiful landscapes.',
      coordinates: { lat: 23.634, lon: 85.543 },
      visitors: 2874,
      rating: 4.6,
      entryFee: { indian: 30, foreigner: 100 }
    },
    {
      name: 'Tagore Hill',
      type: 'Historical',
      district: 'Ranchi',
      description: 'Hill named after Rabindranath Tagore who spent time here, offering panoramic views.',
      coordinates: { lat: 23.367, lon: 85.325 },
      visitors: 3892,
      rating: 4.3,
      entryFee: { indian: 20, foreigner: 80 }
    }
  ];

  await Destination.insertMany(destinations);
  console.log('Database initialized with sample data');
  process.exit(0);
};

initDatabase();