const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');

// Register new superadmin (first superadmin can be created without auth)
exports.registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: '❌ Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '❌ Password must be at least 6 characters' });
    }

    // Check if superadmin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ email });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: '❌ Superadmin with this email already exists' });
    }

    // Check if any superadmins exist in the system
    const superadminCount = await SuperAdmin.countDocuments();
    
    // First superadmin can register freely, be careful!
    if (superadminCount > 0) {
      return res.status(403).json({ message: '❌ Superadmin account already exists. Contact existing superadmin for access.' });
    }

    // Create new superadmin
    const superAdmin = new SuperAdmin({
      name,
      email,
      password,
    });

    await superAdmin.save();

    res.status(201).json({
      message: '✅ Superadmin created successfully! You now have full access.',
      superadmin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
        permissions: superAdmin.permissions,
      }
    });
  } catch (error) {
    console.error('Register superadmin error:', error);
    res.status(500).json({ message: '❌ Failed to register superadmin' });
  }
};

// Superadmin login
exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: '❌ Email and password are required' });
    }

    // Find superadmin by email (include password field for comparison)
    const superAdmin = await SuperAdmin.findOne({ email }).select('+password');
    if (!superAdmin) {
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    // Check if superadmin is active
    if (!superAdmin.isActive) {
      return res.status(403).json({ message: '❌ Superadmin account is disabled' });
    }

    // Compare password
    const isPasswordValid = await superAdmin.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    // Update last login
    superAdmin.lastLogin = new Date();
    await superAdmin.save();

    // Generate JWT token with superadmin flag
    const token = jwt.sign(
      {
        id: superAdmin._id,
        email: superAdmin.email,
        role: superAdmin.role,
        type: 'superadmin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: '✅ Superadmin logged in successfully',
      token,
      superadmin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
        permissions: superAdmin.permissions,
      }
    });
  } catch (error) {
    console.error('Login superadmin error:', error);
    res.status(500).json({ message: '❌ Failed to login' });
  }
};

// Get superadmin profile
exports.getSuperAdminProfile = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.user.id);
    if (!superAdmin) {
      return res.status(404).json({ message: 'Superadmin not found' });
    }

    res.json({
      superadmin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
        permissions: superAdmin.permissions,
        isActive: superAdmin.isActive,
        lastLogin: superAdmin.lastLogin,
        createdAt: superAdmin.createdAt,
      }
    });
  } catch (error) {
    console.error('Get superadmin profile error:', error);
    res.status(500).json({ message: '❌ Failed to fetch superadmin profile' });
  }
};

// Change superadmin password
exports.changeSuperAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '❌ Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: '❌ New password must be at least 6 characters' });
    }

    const superAdmin = await SuperAdmin.findById(req.user.id).select('+password');

    // Verify current password
    const isPasswordValid = await superAdmin.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '❌ Current password is incorrect' });
    }

    // Update password
    superAdmin.password = newPassword;
    await superAdmin.save();

    res.json({ message: '✅ Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: '❌ Failed to change password' });
  }
};
