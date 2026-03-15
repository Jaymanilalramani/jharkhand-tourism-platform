const validateDestination = (req, res, next) => {
  const { name, type, district, description } = req.body;

  if (!name || !type || !district || !description) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  next();
};

const validateBooking = (req, res, next) => {
  const { userId, destinationId, checkIn, checkOut } = req.body;

  if (!userId || !destinationId || !checkIn || !checkOut) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ message: 'Check-out date must be after check-in date' });
  }

  next();
};

module.exports = { validateDestination, validateBooking };