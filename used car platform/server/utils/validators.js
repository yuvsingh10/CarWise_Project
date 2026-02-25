// Input validation utilities for CarWise API

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: '❌ Invalid email format. Please use a valid email address.' };
  }
  return { valid: true };
};

/**
 * Validate phone number (10 digits only)
 */
const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: '❌ Phone must be exactly 10 digits (no spaces or special characters).' };
  }
  return { valid: true };
};

/**
 * Validate password
 */
const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, error: '❌ Password must be at least 6 characters long' };
  }
  if (password.length > 50) {
    return { valid: false, error: '❌ Password cannot exceed 50 characters' };
  }
  return { valid: true };
};

/**
 * Validate name (letters, spaces, and hyphens only)
 */
const validateName = (name) => {
  if (name.length < 2) {
    return { valid: false, error: '❌ Name must be at least 2 characters long' };
  }
  if (name.length > 50) {
    return { valid: false, error: '❌ Name cannot exceed 50 characters' };
  }
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: '❌ Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  return { valid: true };
};

/**
 * Sanitize string input (remove dangerous characters)
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>\"'`]/g, '') // Remove HTML/script characters
    .trim();
};

/**
 * Validate car price (positive number, max 10 crores)
 */
const validatePrice = (price) => {
  const priceNum = parseFloat(price);
  
  if (isNaN(priceNum)) {
    return { valid: false, error: '❌ Price must be a valid number' };
  }
  
  if (priceNum <= 0) {
    return { valid: false, error: '❌ Price must be greater than 0' };
  }
  
  if (priceNum > 100000000) { // 10 crores
    return { valid: false, error: '❌ Price cannot exceed ₹10,00,00,000' };
  }
  
  return { valid: true, value: priceNum };
};

/**
 * Validate car model year (1990 to current year + 1)
 */
const validateModelYear = (year) => {
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  
  if (isNaN(yearNum)) {
    return { valid: false, error: '❌ Model year must be a valid number' };
  }
  
  if (yearNum < 1990) {
    return { valid: false, error: '❌ Model year must be 1990 or later' };
  }
  
  if (yearNum > currentYear + 1) {
    return { valid: false, error: `❌ Model year cannot be in the future (current year: ${currentYear})` };
  }
  
  return { valid: true, value: yearNum };
};

/**
 * Validate KMs driven (non-negative, max 2 million)
 */
const validateKmsDriven = (kms) => {
  const kmsNum = parseInt(kms);
  
  if (isNaN(kmsNum)) {
    return { valid: false, error: '❌ Kilometers driven must be a valid number' };
  }
  
  if (kmsNum < 0) {
    return { valid: false, error: '❌ Kilometers driven cannot be negative' };
  }
  
  if (kmsNum > 2000000) {
    return { valid: false, error: '❌ Kilometers driven cannot exceed 2,000,000' };
  }
  
  return { valid: true, value: kmsNum };
};

/**
 * Validate ownership (1, 2, or 3+)
 */
const validateOwnership = (ownership) => {
  const ownershipNum = parseInt(ownership);
  
  if (isNaN(ownershipNum) || ![1, 2, 3].includes(ownershipNum)) {
    return { valid: false, error: '❌ Ownership must be 1, 2, or 3+' };
  }
  
  return { valid: true, value: ownershipNum };
};

/**
 * Validate seats (2, 4, 5, 7, or 9)
 */
const validateSeats = (seats) => {
  const seatsNum = parseInt(seats);
  const validSeats = [2, 4, 5, 7, 9];
  
  if (isNaN(seatsNum) || !validSeats.includes(seatsNum)) {
    return { valid: false, error: '❌ Number of seats must be 2, 4, 5, 7, or 9' };
  }
  
  return { valid: true, value: seatsNum };
};

/**
 * Validate fuel type
 */
const validateFuelType = (fuelType) => {
  const validFuels = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];
  
  if (!validFuels.includes(fuelType)) {
    return { valid: false, error: `❌ Fuel type must be one of: ${validFuels.join(', ')}` };
  }
  
  return { valid: true };
};

/**
 * Validate transmission
 */
const validateTransmission = (transmission) => {
  const validTransmissions = ['Manual', 'Automatic'];
  
  if (!validTransmissions.includes(transmission)) {
    return { valid: false, error: `❌ Transmission must be one of: ${validTransmissions.join(', ')}` };
  }
  
  return { valid: true };
};

/**
 * Validate car description (optional, max 500 chars)
 */
const validateDescription = (description) => {
  if (!description) return { valid: true };
  
  if (typeof description !== 'string') {
    return { valid: false, error: '❌ Description must be text' };
  }
  
  if (description.length > 500) {
    return { valid: false, error: '❌ Description cannot exceed 500 characters' };
  }
  
  return { valid: true };
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  sanitizeString,
  validatePrice,
  validateModelYear,
  validateKmsDriven,
  validateOwnership,
  validateSeats,
  validateFuelType,
  validateTransmission,
  validateDescription,
};
