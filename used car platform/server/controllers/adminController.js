const User = require('../models/User');
const Car = require('../models/Car');

// Get all users with optional filtering
exports.getAllUsers = async (req, res) => {
  try {
    const { search, suspended, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (suspended === 'true') {
      filter.isSuspended = true;
    } else if (suspended === 'false') {
      filter.isSuspended = false;
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('+isAdmin')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      users,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalUsers: total,
        usersPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: '❌ Failed to fetch users' });
  }
};

// Get all cars with optional filtering
exports.getAllCars = async (req, res) => {
  try {
    const { search, removed, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (removed === 'true') {
      filter.isRemoved = true;
    } else if (removed === 'false') {
      filter.isRemoved = false;
    }

    const total = await Car.countDocuments(filter);
    const cars = await Car.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('ownerId', 'name email phone')
      .lean();

    res.json({
      cars,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCars: total,
        carsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('Get all cars error:', error);
    res.status(500).json({ message: '❌ Failed to fetch cars' });
  }
};

// Suspend/ban a user
exports.suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Suspension reason required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isSuspended: true,
        suspensionReason: reason,
        suspendedAt: new Date()
      },
      { new: true }
    ).select('+isAdmin');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `✅ User ${user.name} has been suspended`, user });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ message: '❌ Failed to suspend user' });
  }
};

// Unsuspend a user
exports.unsuspendUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isSuspended: false,
        suspensionReason: '',
        suspendedAt: null
      },
      { new: true }
    ).select('+isAdmin');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `✅ User ${user.name} has been unsuspended`, user });
  } catch (error) {
    console.error('Unsuspend user error:', error);
    res.status(500).json({ message: '❌ Failed to unsuspend user' });
  }
};

// Remove a car listing
exports.removeCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Removal reason required' });
    }

    const car = await Car.findByIdAndUpdate(
      carId,
      {
        isRemoved: true,
        removalReason: reason,
        removedAt: new Date(),
        removedBy: req.user.id
      },
      { new: true }
    ).populate('ownerId', 'name email phone');

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: `✅ Car listing "${car.name}" has been removed`, car });
  } catch (error) {
    console.error('Remove car error:', error);
    res.status(500).json({ message: '❌ Failed to remove car' });
  }
};

// Restore a removed car listing
exports.restoreCar = async (req, res) => {
  try {
    const { carId } = req.params;

    const car = await Car.findByIdAndUpdate(
      carId,
      {
        isRemoved: false,
        removalReason: '',
        removedAt: null,
        removedBy: null
      },
      { new: true }
    ).populate('ownerId', 'name email phone');

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: `✅ Car listing "${car.name}" has been restored`, car });
  } catch (error) {
    console.error('Restore car error:', error);
    res.status(500).json({ message: '❌ Failed to restore car' });
  }
};

// Get platform analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    const suspendedUsers = await User.countDocuments({ isSuspended: true });
    const activeUsers = totalUsers - suspendedUsers;

    // Total cars
    const totalCars = await Car.countDocuments();
    const removedCars = await Car.countDocuments({ isRemoved: true });
    const activeCars = totalCars - removedCars;

    // Get average car price
    const priceStats = await Car.aggregate([
      { $match: { isRemoved: false } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalPrice: { $sum: '$price' }
        }
      }
    ]);

    const avgPrice = priceStats[0]?.avgPrice || 0;
    const minPrice = priceStats[0]?.minPrice || 0;
    const maxPrice = priceStats[0]?.maxPrice || 0;
    const totalRevenue = priceStats[0]?.totalPrice || 0; // Hypothetical total if all sold

    // Cars by fuel type
    const carsByFuelType = await Car.aggregate([
      { $match: { isRemoved: false } },
      { $group: { _id: '$fuelType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentCars = await Car.find({ isRemoved: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('ownerId', 'name email')
      .lean();

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers
      },
      cars: {
        total: totalCars,
        active: activeCars,
        removed: removedCars
      },
      pricing: {
        average: Math.round(avgPrice),
        minimum: minPrice,
        maximum: maxPrice,
        hypotheticalRevenue: Math.round(totalRevenue)
      },
      carsByFuelType,
      recentActivity: {
        users: recentUsers,
        cars: recentCars
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: '❌ Failed to fetch analytics' });
  }
};

// Permanently delete a user (hard delete from database)
exports.permanentlyDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hard delete - remove from database permanently
    await User.findByIdAndDelete(userId);

    res.json({
      message: `✅ User ${user.name} has been permanently deleted from the system`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Permanently delete user error:', error);
    res.status(500).json({ message: '❌ Failed to permanently delete user' });
  }
};

// Permanently delete a car listing (hard delete from database)
exports.permanentlyDeleteCar = async (req, res) => {
  try {
    const { carId } = req.params;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Hard delete - remove from database permanently
    await Car.findByIdAndDelete(carId);

    res.json({
      message: `✅ Car listing has been permanently deleted from the system`,
      car: {
        id: car._id,
        title: car.title,
        brand: car.brand,
      }
    });
  } catch (error) {
    console.error('Permanently delete car error:', error);
    res.status(500).json({ message: '❌ Failed to permanently delete car' });
  }
};
