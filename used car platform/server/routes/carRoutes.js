const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const carCtrl = require('../controllers/carController');

router.get('/', carCtrl.getAllCars);          
router.post('/', auth, carCtrl.createCar);    
router.put('/:id', auth, carCtrl.updateCar);  
router.delete('/:id', auth, carCtrl.deleteCar);
router.post('/:carId/favorite', auth, carCtrl.toggleFavorite);
router.get('/favorites', auth, carCtrl.getUserFavorites);

module.exports = router;
