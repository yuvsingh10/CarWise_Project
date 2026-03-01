const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Register new admin (superadmin only)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: '❌ Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '❌ Password must be at least 6 characters' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: '❌ Admin with this email already exists' });
    }

    // Create new admin (created by superadmin)
    const admin = new Admin({
      name,
      email,
      password,
      role: 'moderator',
      createdBy: req.user.id, // req.user.id is the superadmin who created this
    });

    await admin.save();

    res.status(201).json({
      message: '✅ Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdBy: admin.createdBy,
      }
    });
  } catch (error) {
    console.error('Register admin error:', error);
    res.status(500).json({ message: '❌ Failed to register admin' });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: '❌ Email and password are required' });
    }

    // Find admin by email (include password field for comparison)
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({ message: '❌ Admin account is disabled' });
    }

    // Compare password
    const isPasswordValid = await admin.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token with admin flag
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        type: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: '✅ Admin logged in successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      }
    });
  } catch (error) {
    console.error('Login admin error:', error);
    res.status(500).json({ message: '❌ Failed to login' });
  }
};

// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: '❌ Failed to fetch admin profile' });
  }
};

// Change admin password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '❌ Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: '❌ New password must be at least 6 characters' });
    }

    const admin = await Admin.findById(req.user.id).select('+password');

    // Verify current password
    const isPasswordValid = await admin.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '❌ Current password is incorrect' });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({ message: '✅ Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: '❌ Failed to change password' });
  }
};

// Get all admins (superadmin only)
exports.getAllAdmins = async (req, res) => {
  try {
    const { search, active } = req.query;
    let query = {};

    // Filter by search term
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by active status
    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    }

    const admins = await Admin.find(query)
      .select('_id name email role permissions isActive lastLogin createdAt')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      message: '✅ Admins retrieved',
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ message: '❌ Failed to fetch admins' });
  }
};

// Delete admin (superadmin only) - soft delete by disabling
exports.deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: '❌ Admin not found' });
    }

    // Soft delete - disable instead of removing
    admin.isActive = false;
    await admin.save();

    res.json({
      message: '✅ Admin disabled successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: '❌ Failed to delete admin' });
  }
};

// Restore admin (superadmin only)
exports.restoreAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: '❌ Admin not found' });
    }

    admin.isActive = true;
    await admin.save();

    res.json({
      message: '✅ Admin restored successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Restore admin error:', error);
    res.status(500).json({ message: '❌ Failed to restore admin' });
  }
};

// Permanently delete admin (hard delete from database)
exports.permanentlyDeleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: '❌ Admin not found' });
    }

    // Hard delete - remove from database permanently
    await Admin.findByIdAndDelete(adminId);

    res.json({
      message: '✅ Admin permanently deleted from the system',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      }
    });
  } catch (error) {
    console.error('Permanently delete admin error:', error);
    res.status(500).json({ message: '❌ Failed to permanently delete admin' });
  }
};
