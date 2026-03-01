const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  changePassword,
  getAllAdmins,
  deleteAdmin,
  restoreAdmin,
  permanentlyDeleteAdmin
} = require('../controllers/adminAuthController');
const { protect } = require('../middleware/authMiddleware');
const { superAdminOnly } = require('../middleware/superAdminMiddleware');

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);

// Protected routes (superadmin only)
router.post('/register', protect, superAdminOnly, registerAdmin);
router.get('/all', protect, superAdminOnly, getAllAdmins);
router.delete('/:adminId', protect, superAdminOnly, deleteAdmin);
router.delete('/:adminId/permanent', protect, superAdminOnly, permanentlyDeleteAdmin);
router.put('/:adminId/restore', protect, superAdminOnly, restoreAdmin);

// Protected routes (any authenticated admin/superadmin)
router.get('/me', protect, getAdminProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
