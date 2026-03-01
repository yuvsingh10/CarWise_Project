const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOrSuperAdminOnly } = require('../middleware/adminMiddleware');
const adminCtrl = require('../controllers/adminController');

// All admin routes require authentication and admin/superadmin status
router.use(protect, adminOrSuperAdminOnly);

// User management
router.get('/users', adminCtrl.getAllUsers);
router.put('/users/:userId/suspend', adminCtrl.suspendUser);
router.put('/users/:userId/unsuspend', adminCtrl.unsuspendUser);
router.delete('/users/:userId/permanent', adminCtrl.permanentlyDeleteUser);

// Car management
router.get('/cars', adminCtrl.getAllCars);
router.put('/cars/:carId/remove', adminCtrl.removeCar);
router.put('/cars/:carId/restore', adminCtrl.restoreCar);
router.delete('/cars/:carId/permanent', adminCtrl.permanentlyDeleteCar);

// Analytics
router.get('/analytics', adminCtrl.getAnalytics);

module.exports = router;
