const Car = require('../models/Car');


exports.getAllCars = async (_req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cars' });
  }
};


exports.createCar = async (req, res) => {
  try {
    const newCar = await Car.create({
      ...req.body,
      registeredEmail: req.user.email,   // guarantee owner
    });
    res.status(201).json(newCar);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create car' });
  }
};


exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    if (car.registeredEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update car' });
  }
};


exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    if (car.registeredEmail !== req.user.email)
      return res.status(403).json({ message: 'Not authorized' });

    await car.deleteOne();
    res.json({ message: 'Car deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete car' });
  }
};
