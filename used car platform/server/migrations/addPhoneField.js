const mongoose = require('mongoose');
const User = require('../models/User');

const addPhoneFieldToUsers = async () => {
  try {
    console.log('🔄 Starting migration: Adding phone field to existing users...');
    
    // Update all users that don't have a phone field and set it to empty string
    const result = await User.updateMany(
      { phone: { $exists: false } },
      { $set: { phone: '' } }
    );
    
    console.log('✅ Migration completed!');
    console.log(`📊 Updated ${result.modifiedCount} users with phone field`);
    console.log(`ℹ️ Matched ${result.matchedCount} users without phone field`);
    
    return result;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
};

module.exports = addPhoneFieldToUsers;
