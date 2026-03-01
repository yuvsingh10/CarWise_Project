const Rating = require('../models/Rating');
const Car = require('../models/Car');
const User = require('../models/User');
const Message = require('../models/Message');

// @desc    Create a new rating/review
// @route   POST /api/ratings/create
// @access  Private
exports.createRating = async (req, res) => {
  try {
    const { ratedUserId, carId, rating, comment } = req.body;
    const currentUserId = req.user.id;

    // Validation
    if (!ratedUserId || !carId || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Can't rate yourself
    if (currentUserId === ratedUserId) {
      return res.status(400).json({ error: 'You cannot rate yourself' });
    }

    // Verify car exists and is owned by rated user
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    if (car.ownerId.toString() !== ratedUserId) {
      return res.status(400).json({ error: 'Invalid car owner' });
    }

    // Check if there's a message conversation (proof of interaction)
    const conversation = await Message.findOne({
      $or: [
        {
          senderId: currentUserId,
          recipientId: ratedUserId,
          carId: carId,
        },
        {
          senderId: ratedUserId,
          recipientId: currentUserId,
          carId: carId,
        },
      ],
    });

    if (!conversation) {
      return res.status(400).json({
        error: 'You can only rate users you have communicated with',
      });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      ratedUser: ratedUserId,
      ratedBy: currentUserId,
      car: carId,
    });

    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this user for this car' });
    }

    // Create new rating
    const newRating = new Rating({
      ratedUser: ratedUserId,
      ratedBy: currentUserId,
      car: carId,
      rating,
      comment: comment || '',
    });

    await newRating.save();

    // Populate references
    await newRating.populate('ratedBy', 'name phone photo');
    await newRating.populate('car', 'name');

    res.status(201).json({
      success: true,
      data: newRating,
    });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all ratings for a user
// @route   GET /api/ratings/user/:userId
// @access  Public
exports.getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratings = await Rating.find({ ratedUser: userId })
      .populate('ratedBy', 'name phone photo')
      .populate('car', 'name')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? (totalRating / ratings.length).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        ratings,
        averageRating,
        totalReviews: ratings.length,
      },
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get average rating for a user
// @route   GET /api/ratings/average/:userId
// @access  Public
exports.getAverageRating = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratings = await Rating.find({ ratedUser: userId });

    if (ratings.length === 0) {
      return res.json({
        success: true,
        data: {
          averageRating: 0,
          totalReviews: 0,
        },
      });
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / ratings.length).toFixed(1);

    res.json({
      success: true,
      data: {
        averageRating,
        totalReviews: ratings.length,
      },
    });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Check if current user can rate another user
// @route   GET /api/ratings/can-rate/:userId/:carId
// @access  Private
exports.canRateUser = async (req, res) => {
  try {
    const { userId, carId } = req.params;
    const currentUserId = req.user.id;

    // Can't rate yourself
    if (currentUserId === userId) {
      return res.json({ canRate: false, reason: 'You cannot rate yourself' });
    }

    // Check if car exists and is owned by rated user
    const car = await Car.findById(carId);
    if (!car || car.ownerId.toString() !== userId) {
      return res.json({ canRate: false, reason: 'Invalid car owner' });
    }

    // Check if there's a message conversation
    const conversation = await Message.findOne({
      $or: [
        {
          senderId: currentUserId,
          recipientId: userId,
          carId: carId,
        },
        {
          senderId: userId,
          recipientId: currentUserId,
          carId: carId,
        },
      ],
    });

    if (!conversation) {
      return res.json({
        canRate: false,
        reason: 'You can only rate users you have communicated with',
      });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      ratedUser: userId,
      ratedBy: currentUserId,
      car: carId,
    });

    if (existingRating) {
      return res.json({
        canRate: false,
        reason: 'You have already rated this user',
        existingRating,
      });
    }

    res.json({ canRate: true });
  } catch (error) {
    console.error('Error checking rating eligibility:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a rating (only by creator)
// @route   DELETE /api/ratings/:ratingId
// @access  Private
exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const currentUserId = req.user.id;

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    // Check if user is the one who created the rating
    if (rating.ratedBy.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Not authorized to delete this rating' });
    }

    await Rating.findByIdAndDelete(ratingId);

    res.json({ success: true, message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ error: error.message });
  }
};
