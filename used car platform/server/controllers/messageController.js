const Message = require('../models/Message');
const Car = require('../models/Car');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, carId, message } = req.body;
    const senderId = req.user.id;

    // Validation
    if (!recipientId || !carId || !message) {
      return res.status(400).json({
        error: 'Missing fields: recipientId, carId, message are required',
      });
    }

    if (message.trim().length === 0 || message.trim().length > 2000) {
      return res.status(400).json({
        error: 'Message must be between 1 and 2000 characters',
      });
    }

    if (senderId === recipientId) {
      return res.status(400).json({
        error: 'Cannot send message to yourself',
      });
    }

    // Verify car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car listing not found' });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    // Create and save message
    const newMessage = new Message({
      senderId,
      recipientId,
      carId,
      message: message.trim(),
    });

    await newMessage.save();

    // Populate sender info
    await newMessage.populate('senderId', 'name email phone');
    await newMessage.populate('carId', 'name price photo');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Failed to send message. Please try again.',
      details: error.message,
    });
  }
};

// Get conversation between two users for a specific car
exports.getConversation = async (req, res) => {
  try {
    const { otherUserId, carId } = req.params;
    const userId = req.user.id;

    if (!otherUserId || !carId) {
      return res.status(400).json({
        error: 'Missing required parameters: otherUserId, carId',
      });
    }

    // Get all messages between these two users for this car
    const messages = await Message.find({
      carId,
      $or: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    })
      .populate('senderId', 'name email phone photo')
      .populate('carId', 'name price photo')
      .sort({ createdAt: 1 });

    // Mark messages as read if they were received by current user
    await Message.updateMany(
      {
        carId,
        senderId: otherUserId,
        recipientId: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    // Get other user's basic info
    const otherUser = await User.findById(otherUserId).select(
      'name email phone'
    );

    res.status(200).json({
      success: true,
      data: {
        otherUser,
        car: { id: carId },
        messages,
      },
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      error: 'Failed to fetch conversation. Please try again.',
      details: error.message,
    });
  }
};

// Get all conversations for current user (with last message preview)
exports.getAllConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all unique conversations (sender/recipient pairs)
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { recipientId: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            otherUserId: {
              $cond: [
                { $eq: ['$senderId', userId] },
                '$recipientId',
                '$senderId',
              ],
            },
            carId: '$carId',
          },
          lastMessage: { $first: '$message' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipientId', userId] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.otherUserId',
          foreignField: '_id',
          as: 'otherUserInfo',
        },
      },
      {
        $lookup: {
          from: 'cars',
          localField: '_id.carId',
          foreignField: '_id',
          as: 'carInfo',
        },
      },
      {
        $project: {
          otherUser: { $arrayElemAt: ['$otherUserInfo', 0] },
          car: { $arrayElemAt: ['$carInfo', 0] },
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1,
          carId: '$_id.carId',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      error: 'Failed to fetch conversations. Please try again.',
      details: error.message,
    });
  }
};

// Get unread message count for current user
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      error: 'Failed to fetch unread count. Please try again.',
      details: error.message,
    });
  }
};

// Mark specific message as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.recipientId.toString() !== userId) {
      return res.status(403).json({
        error: 'You can only mark your own received messages as read',
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      error: 'Failed to mark message as read. Please try again.',
      details: error.message,
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        error: 'You can only delete messages you sent',
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      error: 'Failed to delete message. Please try again.',
      details: error.message,
    });
  }
};

// Get messages for a specific car (for car owner to see all inquiries)
exports.getCarInquiries = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.user.id;

    // Verify user owns the car
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car listing not found' });
    }

    if (car.ownerId.toString() !== userId) {
      return res.status(403).json({
        error: 'You can only view inquiries for your own car listings',
      });
    }

    // Get all messages for this car
    const inquiries = await Message.find({ carId })
      .populate('senderId', 'name email phone')
      .populate('recipientId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error('Get car inquiries error:', error);
    res.status(500).json({
      error: 'Failed to fetch car inquiries. Please try again.',
      details: error.message,
    });
  }
};
