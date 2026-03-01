const SuperAdmin = require('../models/SuperAdmin');

const superAdminOnly = async (req, res, next) => {
  try {
    // First check if user is authenticated (protect middleware should run first)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if token is from superadmin (marked with type: 'superadmin' in JWT)
    if (req.user.type !== 'superadmin') {
      return res.status(403).json({ message: '🔐 Superadmin access required' });
    }

    // Fetch superadmin to verify account is active
    const superAdmin = await SuperAdmin.findById(req.user.id);

    if (!superAdmin) {
      return res.status(404).json({ message: 'Superadmin not found' });
    }

    if (!superAdmin.isActive) {
      return res.status(403).json({ message: '🔐 Superadmin account is disabled' });
    }

    // Attach superadmin data to request for use in controllers
    req.superAdmin = superAdmin;

    // Superadmin is valid, proceed
    next();
  } catch (error) {
    console.error('Superadmin middleware error:', error);
    res.status(500).json({ message: 'Server error checking superadmin status' });
  }
};

module.exports = { superAdminOnly };
