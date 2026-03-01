const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    ratedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    // Ensure one review per buyer-seller-car combination
    uniqueKey: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto-generate unique key before saving
ratingSchema.pre('save', function (next) {
  if (!this.uniqueKey) {
    this.uniqueKey = `${this.ratedBy}_${this.ratedUser}_${this.car}`;
  }
  next();
});

module.exports = mongoose.model('Rating', ratingSchema);
