const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');

const adminOnly = async (req, res, next) => {
  try {
    // First check if user is authenticated (protect middleware should run first)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if token is from admin (marked with type: 'admin' in JWT)
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Fetch admin to verify permissions
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Admin account is disabled' });
    }

    // Attach admin data to request for use in controllers
    req.admin = admin;

    // Admin is valid, proceed
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error checking admin status' });
  }
};

// Middleware that allows BOTH admin and superadmin
const adminOrSuperAdminOnly = async (req, res, next) => {
  try {
    // First check if user is authenticated (protect middleware should run first)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if token is from admin or superadmin
    if (req.user.type === 'admin') {
      // Fetch admin to verify permissions
      const admin = await Admin.findById(req.user.id);

      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      if (!admin.isActive) {
        return res.status(403).json({ message: 'Admin account is disabled' });
      }

      // Attach admin data to request for use in controllers
      req.admin = admin;
      next();
    } else if (req.user.type === 'superadmin') {
      // Fetch superadmin to verify permissions
      const superAdmin = await SuperAdmin.findById(req.user.id);

      if (!superAdmin) {
        return res.status(404).json({ message: 'SuperAdmin not found' });
      }

      if (!superAdmin.isActive) {
        return res.status(403).json({ message: 'SuperAdmin account is disabled' });
      }

      // Attach superadmin data to request for use in controllers
      req.superAdmin = superAdmin;
      req.admin = superAdmin; // Also attach to req.admin for controller compatibility
      next();
    } else {
      return res.status(403).json({ message: 'Admin or SuperAdmin access required' });
    }
  } catch (error) {
    console.error('Admin/SuperAdmin middleware error:', error);
    res.status(500).json({ message: 'Server error checking admin status' });
  }
};

module.exports = { adminOnly, adminOrSuperAdminOnly };
