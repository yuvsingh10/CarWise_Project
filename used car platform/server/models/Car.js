const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    price:      { type: Number, required: true },         
    photo:      { type: String },                         
    ownerId:    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ownerPhone: { type: String },
    modelYear:  { type: Number },
    fuelType:   { type: String },
    transmission: { type: String },
    kmsDriven:  { type: Number },
    ownership:  { type: Number },                          
    seats:      { type: Number },
    description: { type: String },
    favoriteBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },
  { timestamps: true }
);

// Database indexes for optimized queries
carSchema.index({ ownerId: 1 });
carSchema.index({ price: 1, modelYear: -1 });
carSchema.index({ modelYear: 1 });
carSchema.index({ kmsDriven: 1 });
carSchema.index({ favoriteBy: 1 });
carSchema.index({ createdAt: -1 });
carSchema.index({ name: 'text', description: 'text' }); // Full-text search index
carSchema.index({ price: 1, modelYear: 1, kmsDriven: 1 }); // Compound index for filters

module.exports = mongoose.model('Car', carSchema);
