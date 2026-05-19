const express = require('express');
const router = express.Router();
const {
  getShowtimesByMovie,
  getShowtimeById,
} = require('../controllers/showtime.controller');

router.get('/movie/:movieId', getShowtimesByMovie);
router.get('/:id', getShowtimeById);

module.exports = router;
