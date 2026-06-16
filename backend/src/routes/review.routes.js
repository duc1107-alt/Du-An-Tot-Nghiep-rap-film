const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByMovie,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

// Public: Xem đánh giá của phim (không cần đăng nhập)
router.get('/movie/:movieId', getReviewsByMovie);

// Private: Tạo / Sửa / Xóa đánh giá (cần đăng nhập)
router.post('/', protect, createReview);
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
