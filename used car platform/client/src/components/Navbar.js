import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      padding: '10px 20px',
      background: '#007BFF',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      fontWeight: '600',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
      <Link to="/my-cars" style={{ color: '#fff', textDecoration: 'none' }}>My Cars</Link>
      <Link to="/sell" style={{ color: '#fff', textDecoration: 'none' }}>Sell Your Car</Link>
      <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
      <Link to="/favorites" style={{ color: '#fff', textDecoration: 'none' }}>Favorites</Link>
      <Link 
        to="/messages" 
        style={{ 
          color: '#fff', 
          textDecoration: 'none',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        💬 Messages
        {unreadCount > 0 && (
          <span style={{
            background: '#ff4757',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'bold',
            minWidth: '20px',
            textAlign: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </Link>
      
      <button
        onClick={handleLogout}
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: '1px solid #fff',
          borderRadius: 4,
          color: '#fff',
          cursor: 'pointer',
          padding: '5px 12px',
          fontWeight: '600',
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
