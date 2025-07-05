const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true },
    price:           { type: String, required: true },         
    photo:           { type: String },                         
    registeredEmail: { type: String, required: true },         
    ownerPhone:      { type: String },                          
    modelYear:       { type: Number },
    fuelType:        { type: String },
    transmission:    { type: String },
    kmsDriven:       { type: Number },
    ownership:       { type: String },                          
    seats:           { type: Number },
    description:     { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
