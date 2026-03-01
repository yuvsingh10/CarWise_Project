const express = require('express');
const {
  registerSuperAdmin,
  loginSuperAdmin,
  getSuperAdminProfile,
  changeSuperAdminPassword
} = require('../controllers/superAdminAuthController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerSuperAdmin);
router.post('/login', loginSuperAdmin);

// Protected routes
router.get('/me', protect, getSuperAdminProfile);
router.put('/change-password', protect, changeSuperAdminPassword);

module.exports = router;
