const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['moderator'],
    default: 'moderator',
  },
  permissions: [
    {
      type: String,
      enum: ['manage_users', 'manage_cars', 'view_analytics'],
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperAdmin',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Database indexes
adminSchema.index({ email: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ createdBy: 1 });

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  
  // Assign limited permissions to moderator admin
  if (!this.permissions || this.permissions.length === 0) {
    this.permissions = ['manage_users', 'manage_cars', 'view_analytics'];
  }
  next();
});

// Compare password method
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
