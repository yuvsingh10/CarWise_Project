import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Delete = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setUser(jwtDecode(token));
    } catch {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  const handleDelete = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first.');
      return;
    }

    fetch('http://localhost:5000/api/auth/delete', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Account deleted successfully');
        localStorage.removeItem('token');
        navigate('/');
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Failed to delete account. Please try again.');
      });
  };

  return (
    <div style={wrapper}>
      <div style={box}>
        <h2 style={{ marginBottom: 20, color: '#ef5350', fontWeight: '900', fontSize: '1.8rem' }}>Delete Account</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Are you sure you want to permanently delete your account and all related data?</p>

        <div style={{ marginTop: 25 }}>
          <button onClick={() => navigate(-1)} style={btnGrey}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#5a626d';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#6c757d';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cancel
          </button>
          <button onClick={handleDelete} style={btnRed}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef5350';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f44336';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

const wrapper = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/BG2.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  fontFamily: 'Segoe UI, sans-serif',
};
const box = {
  width: 380,
  background: 'rgba(0, 0, 0, 0.15)',
  padding: 35,
  borderRadius: 20,
  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(20px)',
  textAlign: 'center',
  color: 'rgba(255, 255, 255, 0.9)',
};
const btnGrey = {
  padding: '11px 24px',
  marginRight: 10,
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: '700',
};
const btnRed = {
  padding: '11px 24px',
  background: '#f44336',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: '700',
  boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)',
};

export default Delete;
