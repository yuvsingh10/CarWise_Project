const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Send a message
router.post('/send', messageController.sendMessage);

// Get conversation with another user for a specific car
router.get('/conversation/:otherUserId/:carId', messageController.getConversation);

// Get all conversations for current user
router.get('/conversations', messageController.getAllConversations);

// Get unread message count
router.get('/unread-count', messageController.getUnreadCount);

// Mark message as read
router.put('/:messageId/read', messageController.markAsRead);

// Delete a message (only sender can delete)
router.delete('/:messageId', messageController.deleteMessage);

// Get all inquiries for a specific car (only car owner)
router.get('/car/:carId/inquiries', messageController.getCarInquiries);

module.exports = router;
