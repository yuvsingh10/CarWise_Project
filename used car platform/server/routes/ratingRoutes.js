const express = require('express');
const router = express.Router();
const {
  createRating,
  getUserRatings,
  getAverageRating,
  canRateUser,
  deleteRating,
} = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/user/:userId', getUserRatings);
router.get('/average/:userId', getAverageRating);

// Protected routes
router.post('/create', protect, createRating);
router.get('/can-rate/:userId/:carId', protect, canRateUser);
router.delete('/:ratingId', protect, deleteRating);

module.exports = router;
