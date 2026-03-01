const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SuperAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'superadmin',
      enum: ['superadmin'],
    },
    permissions: [
      {
        type: String,
        enum: ['manage_users', 'manage_cars', 'view_analytics', 'manage_admins', 'manage_superadmins'],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
SuperAdminSchema.index({ email: 1 });
SuperAdminSchema.index({ isActive: 1 });

// Pre-save hook: Auto-assign all permissions to superadmin
SuperAdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Assign all permissions to superadmin
    this.permissions = ['manage_users', 'manage_cars', 'view_analytics', 'manage_admins', 'manage_superadmins'];
    next();
  } catch (error) {
    next(error);
  }
});

// Method to match password
SuperAdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);
