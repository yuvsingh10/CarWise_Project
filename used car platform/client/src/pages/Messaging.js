import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Add keyframe animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes messageSlide {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  input:focus {
    border-color: #0084ff !important;
    box-shadow: 0 0 0 2px rgba(0, 132, 255, 0.1) !important;
  }
  button:active:not(:disabled) {
    transform: scale(0.95);
  }
  button {
    transition: all 0.2s ease;
  }
  button:hover:not(:disabled) {
    opacity: 0.9;
  }
`;
document.head.appendChild(styleSheet);

const Messaging = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchConversations();
    fetchUnreadCount();

    // Refresh conversations every 5 seconds for real-time feel
    const interval = setInterval(() => {
      fetchConversations();
      fetchUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate, user]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    fetchConversations();
    fetchUnreadCount();
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return <div>Please log in to access messages</div>;
  }

  // Show message thread if conversation selected
  if (selectedConversation) {
    return (
      <MessageThread
        conversation={selectedConversation}
        onBack={handleBackToList}
        currentUser={user}
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <button onClick={handleBackToDashboard} style={styles.backButtonTop}>
          ← Back to Dashboard
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.pageTitle}>💬 Messages</h1>
          {unreadCount > 0 && (
            <span style={styles.badge}>{unreadCount} unread</span>
          )}
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading conversations...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💭</div>
          <h2>No Messages Yet</h2>
          <p>Find a car and send a message to the seller to get started!</p>
          <button 
            onClick={() => navigate('/dashboard')}
            style={styles.browseButton}
          >
            Browse Cars
          </button>
        </div>
      ) : (
        <div style={styles.conversationsList}>
          {conversations.map((convo) => {
            const initials = convo.otherUser?.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase() || '?';
            
            return (
              <div
                key={`${convo._id.otherUserId}-${convo.carId}`}
                style={styles.conversationItem}
                onClick={() => handleSelectConversation(convo)}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.conversationItemHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.conversationItem)}
              >
                {/* Avatar */}
                <div style={styles.avatar}>{initials}</div>

                {/* Left side: User & Car info */}
                <div style={styles.userSection}>
                  <h3 style={styles.userName}>
                    {convo.otherUser?.name || 'Unknown User'}
                  </h3>
                  <p style={styles.carName}>
                    {convo.car?.name || 'Listing deleted'}
                  </p>
                  <p style={styles.lastMessage}>
                    {convo.lastMessage.substring(0, 60)}
                    {convo.lastMessage.length > 60 ? '...' : ''}
                  </p>
                </div>

                {/* Right side: Time and unread indicator */}
                <div style={styles.timeSection}>
                  <span style={styles.time}>
                    {formatMessageTime(new Date(convo.lastMessageTime))}
                  </span>
                  {convo.unreadCount > 0 && (
                    <span style={styles.unreadBadge}>{convo.unreadCount}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to format time
const formatMessageTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// MessageThread Component
const MessageThread = ({ conversation, onBack, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const otherUser = conversation.otherUser;
  const car = conversation.car;

  useEffect(() => {
    fetchMessages();
  }, [conversation]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(
        `/messages/conversation/${otherUser._id}/${conversation.carId}`
      );
      console.log('Fetch messages response:', response.data);
      
      // Handle both response.data.data.messages and response.data.messages
      const fetchedMessages = response.data.data?.messages || response.data.messages || [];
      console.log('Fetched messages:', fetchedMessages);
      
      setMessages(fetchedMessages);
      setLoading(false);

      // Mark all unread messages from other user as read
      const unreadMessages = fetchedMessages.filter(
        (msg) => msg.senderId._id !== currentUser.id && !msg.isRead
      );

      if (unreadMessages.length > 0) {
        unreadMessages.forEach((msg) => {
          markMessageAsRead(msg._id);
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error.message);
      setLoading(false);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await api.post('/messages/send', {
        recipientId: otherUser._id,
        carId: conversation.carId,
        message: newMessage,
      });

      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.threadContainer}>
      {/* Header */}
      <div style={styles.threadHeader}>
        <button onClick={onBack} style={styles.backButton}>
          ←
        </button>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0084ff 0%, #0073e6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          {otherUser?.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?'}
        </div>
        <div style={styles.threadHeaderContent}>
          <h2 style={styles.threadTitle}>{otherUser.name}</h2>
          <p style={styles.carInfo}>{car?.name || 'Listing'}</p>
        </div>
        <a href={`tel:${otherUser.phone}`} style={styles.phone}>
          📞 {otherUser.phone}
        </a>
      </div>

      {/* Messages */}
      <div style={styles.messagesBox}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div style={styles.emptyMessages}>
            <p>👋 Start the conversation</p>
            <p style={{ fontSize: '12px', color: '#ccc' }}>Send a message to {otherUser.name}</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.messageRow,
                  ...(msg.senderId._id === currentUser.id
                    ? styles.sentMessage
                    : styles.receivedMessage),
                  animation: 'messageSlide 0.3s ease-out',
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(msg.senderId._id === currentUser.id
                      ? styles.sentBubble
                      : styles.receivedBubble),
                  }}
                >
                  <p style={styles.messageText}>{msg.message}</p>
                  <span style={styles.timestamp}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {msg.isRead && msg.senderId._id === currentUser.id && ' ✓✓'}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} style={{ height: '0' }} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} style={styles.inputForm}>
        <input
          type="text"
          placeholder="Aa"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          style={styles.messageInput}
          maxLength="2000"
          autoFocus
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          style={{
            ...styles.sendButton,
            ...(sending || !newMessage.trim() ? styles.sendButtonDisabled : {}),
          }}
        >
          ➤
        </button>
      </form>
    </div>
  );
};

const styles = {
  // Main container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0',
    minHeight: '100vh',
    background: '#fff',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },

  pageHeader: {
    padding: '16px 20px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'linear-gradient(135deg, #0084ff 0%, #0073e6 100%)',
    borderBottom: '1px solid #e5e5e5',
  },

  backButtonTop: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  pageTitle: {
    margin: '0',
    fontSize: '24px',
    fontWeight: 'bold',
  },

  badge: {
    background: '#f02849',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },

  // Loading state
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    color: '#999',
    textAlign: 'center',
    flex: 1,
  },

  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f0f0f0',
    borderTop: '4px solid #0084ff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginBottom: '16px',
  },

  // Empty state
  emptyState: {
    margin: 'auto',
    padding: '60px 20px',
    textAlign: 'center',
    color: '#999',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },

  browseButton: {
    marginTop: '20px',
    background: '#0084ff',
    color: 'white',
    border: 'none',
    padding: '10px 28px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background 0.3s ease',
  },

  // Conversations list
  conversationsList: {
    flex: 1,
    overflowY: 'auto',
    borderRight: '1px solid #e5e5e5',
    background: '#fff',
  },

  conversationItem: {
    padding: '12px 8px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    transition: 'background 0.2s',
  },

  conversationItemHover: {
    background: '#f0f0f0',
  },

  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    flexShrink: 0,
  },

  userSection: {
    flex: 1,
    minWidth: '0',
  },

  userName: {
    margin: '0 0 4px 0',
    fontSize: '15px',
    fontWeight: '500',
    color: '#000',
  },

  carName: {
    margin: '0 0 4px 0',
    fontSize: '12px',
    color: '#65676b',
  },

  lastMessage: {
    margin: '0',
    fontSize: '12px',
    color: '#999',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  timeSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    marginLeft: '8px',
    flexShrink: 0,
  },

  time: {
    fontSize: '11px',
    color: '#999',
  },

  unreadBadge: {
    background: '#0084ff',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
  },

  // MessageThread styles
  threadContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0',
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  threadHeader: {
    background: '#fff',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #e5e5e5',
  },

  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#0084ff',
    fontWeight: 'bold',
    padding: '6px 8px',
    borderRadius: '50%',
    transition: 'background 0.3s ease',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  threadHeaderContent: {
    flex: 1,
    minWidth: '0',
  },

  threadTitle: {
    margin: '0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#000',
  },

  carInfo: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#65676b',
  },

  phone: {
    marginLeft: '12px',
    fontSize: '13px',
    color: '#0084ff',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    textDecoration: 'none',
  },

  messagesBox: {
    flex: 1,
    background: '#fff',
    padding: '16px 20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  emptyMessages: {
    textAlign: 'center',
    color: '#ccc',
    padding: '60px 20px',
    fontSize: '14px',
    margin: 'auto',
  },

  messageRow: {
    display: 'flex',
    marginBottom: '2px',
  },

  sentMessage: {
    justifyContent: 'flex-end',
  },

  receivedMessage: {
    justifyContent: 'flex-start',
  },

  messageBubble: {
    maxWidth: '60%',
    padding: '8px 12px',
    borderRadius: '18px',
    wordWrap: 'break-word',
  },

  sentBubble: {
    background: '#0084ff',
    color: 'white',
    borderBottomRightRadius: '4px',
  },

  receivedBubble: {
    background: '#e5e5e9',
    color: '#000',
    borderBottomLeftRadius: '4px',
  },

  messageText: {
    margin: '0',
    fontSize: '13px',
    lineHeight: '1.4',
  },

  timestamp: {
    fontSize: '11px',
    opacity: 0.6,
    marginTop: '2px',
    display: 'block',
  },

  inputForm: {
    display: 'flex',
    gap: '8px',
    padding: '12px 20px',
    background: '#fff',
    borderTop: '1px solid #e5e5e5',
    alignItems: 'flex-end',
  },

  messageInput: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    resize: 'none',
    maxHeight: '100px',
  },

  sendButton: {
    background: '#0084ff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background 0.2s ease',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default Messaging;
