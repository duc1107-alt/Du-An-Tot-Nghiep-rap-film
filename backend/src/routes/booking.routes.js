const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);

module.exports = router;
