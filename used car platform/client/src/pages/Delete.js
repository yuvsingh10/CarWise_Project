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
    
    localStorage.removeItem('token');
    
    localStorage.removeItem(`profilePhoto_${user.email}`);
    
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    const remaining = cars.filter(c => c.registeredEmail !== user.email);
    localStorage.setItem('cars', JSON.stringify(remaining));
    alert('Account data deleted.');
    navigate('/');
  };

  return (
    <div style={wrapper}>
      <div style={box}>
        <h2 style={{ marginBottom: 20 }}>Delete Account</h2>
        <p>Are you sure you want to permanently delete your account and all related data?</p>

        <div style={{ marginTop: 25 }}>
          <button onClick={() => navigate(-1)} style={btnGrey}>
            Cancel
          </button>
          <button onClick={handleDelete} style={btnRed}>
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
  background: '#f8f9fa',
  fontFamily: 'Segoe UI, sans-serif',
};
const box = {
  width: 380,
  background: '#fff',
  padding: 30,
  borderRadius: 12,
  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
  textAlign: 'center',
};
const btnGrey = {
  padding: '10px 20px',
  marginRight: 10,
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};
const btnRed = {
  ...btnGrey,
  background: '#dc3545',
};

export default Delete;
