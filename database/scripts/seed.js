const mongoose = require('mongoose');
const Destination = require('../../backend/models/Destination');
const User = require('../../backend/models/User');
const Booking = require('../../backend/models/Booking');
const Feedback = require('../../backend/models/Feedback');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/jharkhand-tourism', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Booking.deleteMany({});
  await Feedback.deleteMany({});

  // Create sample users
  const users = await User.insertMany([
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      preferences: {
        interests: ['historical sites', 'nature'],
        budget: 'mid',
        pace: 'moderate'
      }
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      preferences: {
        interests: ['wildlife', 'adventure'],
        budget: 'luxury',
        pace: 'relaxed'
      }
    }
  ]);

  // Get destinations
  const destinations = await Destination.find({});

  // Create sample bookings
  await Booking.insertMany([
    {
      userId: users[0]._id,
      destinationId: destinations[0]._id,
      checkIn: new Date('2023-06-15'),
      checkOut: new Date('2023-06-18'),
      guests: { adults: 2, children: 1 },
      amount: 4500,
      status: 'completed'
    },
    {
      userId: users[1]._id,
      destinationId: destinations[2]._id,
      checkIn: new Date('2023-07-20'),
      checkOut: new Date('2023-07-25'),
      guests: { adults: 2 },
      amount: 8000,
      status: 'confirmed'
    }
  ]);

  // Create sample feedback
  await Feedback.insertMany([
    {
      userId: users[0]._id,
      destinationId: destinations[0]._id,
      rating: 5,
      comment: 'Amazing experience! The waterfall was breathtaking.',
      sentiment: 'positive',
      visitDate: new Date('2023-06-17')
    },
    {
      userId: users[1]._id,
      destinationId: destinations[2]._id,
      rating: 4,
      comment: 'Great wildlife spotting opportunities. Guides were knowledgeable.',
      sentiment: 'positive',
      visitDate: new Date('2023-05-12')
    }
  ]);

  console.log('Database seeded with sample data');
  process.exit(0);
};

seedDatabase();