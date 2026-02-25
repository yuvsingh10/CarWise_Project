const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  sanitizeString,
} = require('../utils/validators');


const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );


exports.register = async (req, res) => {
  try {
    let { name, email, password, phone } = req.body;

    console.log('📝 Register attempt:', { name, email, phone });

    // Validate required fields exist
    if (!name) return res.status(400).json({ message: '❌ Full name is required' });
    if (!email) return res.status(400).json({ message: '❌ Email address is required' });
    if (!password) return res.status(400).json({ message: '❌ Password is required' });
    if (!phone) return res.status(400).json({ message: '❌ Phone number is required' });

    // Sanitize inputs
    name = sanitizeString(name);
    email = sanitizeString(email.toLowerCase());

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) return res.status(400).json({ message: nameValidation.error });

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) return res.status(400).json({ message: emailValidation.error });

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) return res.status(400).json({ message: passwordValidation.error });

    // Validate phone
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) return res.status(400).json({ message: phoneValidation.error });

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: '❌ This email is already registered. Please use a different email or try logging in.' });
    }

    // Create and save user
    const user = new User({ name, email, password, phone });
    await user.save();

    console.log('✅ User registered:', user._id);
    console.log('💾 Phone saved:', user.phone);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: signToken(user),
      message: '✅ Account created successfully!',
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ message: '❌ Email address is already in use. Please try a different email.' });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: '❌ ' + messages.join(', ') });
    }

    res.status(500).json({ message: '❌ Server error during registration. Please try again later.' });
  }
};


exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validate required fields
    if (!email) return res.status(400).json({ message: '❌ Email is required' });
    if (!password) return res.status(400).json({ message: '❌ Password is required' });

    // Sanitize and validate email
    email = sanitizeString(email.toLowerCase());
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) return res.status(400).json({ message: emailValidation.error });

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '❌ Email not found. Please check your email or create a new account.' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '❌ Incorrect password. Please try again.' });
    }

    console.log('✅ Login successful for:', email);
    console.log('📱 User phone from DB:', user.phone);
    
    const token = signToken(user);
    console.log('🔐 Token generated with phone:', user.phone);

    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token,
      message: '✅ Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '❌ Server error during login. Please try again later.' });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '❌ User profile not found. Please log in again.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: '❌ Failed to fetch profile. Please try again later.' });
  }
};


exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '❌ User account not found.' });
    }
    
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: '✅ Account deleted successfully. All your data has been removed.' });
  } catch (error) {
    console.error('Delete account error:', error.message);
    res.status(500).json({ message: '❌ Failed to delete account. Please try again later.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: '❌ Phone number is required' });
    }

    // Sanitize and validate phone
    phone = sanitizeString(phone);
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
      return res.status(400).json({ message: phoneValidation.error });
    }
    
    console.log('📱 Updating phone for user:', req.user.id);
    console.log('📝 New phone:', phone);
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { phone },
      { new: true }
    ).select('-password');
    
    if (!user) {
      console.log('❌ User not found:', req.user.id);
      return res.status(404).json({ message: '❌ User account not found. Please log in again.' });
    }
    
    console.log('✅ Phone updated successfully for:', user.email);
    console.log('💾 Saved phone:', user.phone);
    
    res.json({ message: '✅ Phone number updated successfully', user });
  } catch (error) {
    console.error('❌ Error updating profile:', error.message);
    res.status(500).json({ message: '❌ Failed to update phone number. Please try again later.' });
  }
};
