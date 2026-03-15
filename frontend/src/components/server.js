const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const itineraryRoutes = require('./routes/itinerary');

app.use('/api/itinerary', itineraryRoutes);

app.get('/', (req, res) => {
  res.send('Jharkhand Tourism API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});