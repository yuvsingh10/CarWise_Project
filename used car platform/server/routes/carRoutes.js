const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const carCtrl = require('../controllers/carController');

router.get('/', carCtrl.getAllCars);          
router.post('/', protect, carCtrl.createCar);    
router.put('/:id', protect, carCtrl.updateCar);  
router.delete('/:id', protect, carCtrl.deleteCar);
router.post('/:carId/favorite', protect, carCtrl.toggleFavorite);
router.get('/favorites', protect, carCtrl.getUserFavorites);

module.exports = router;
