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

module.exports = mongoose.model('Car', carSchema);
