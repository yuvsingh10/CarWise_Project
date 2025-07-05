import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
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
