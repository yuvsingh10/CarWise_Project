import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/auth/register', form);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/BG.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: '90%',
          padding: 30,
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          position: 'relative',
        }}
      >
        <button
          onClick={() => navigate('/')}
          aria-label="Back to Home"
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'none',
            border: 'none',
            color: '#007BFF',
            cursor: 'pointer',
            fontSize: 14,
            textDecoration: 'underline',
            padding: 0,
            fontWeight: 600,
            transition: 'color 0.3s',
          }}
          onMouseEnter={e => (e.target.style.color = '#0056b3')}
          onMouseLeave={e => (e.target.style.color = '#007BFF')}
        >
          ← Back to Home
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#222' }}>
          Register
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              marginBottom: 16,
              padding: '14px 16px',
              fontSize: 16,
              borderRadius: 8,
              border: '1.8px solid #ccc',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={e => (e.target.style.borderColor = '#007BFF')}
            onBlur={e => (e.target.style.borderColor = '#ccc')}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              marginBottom: 16,
              padding: '14px 16px',
              fontSize: 16,
              borderRadius: 8,
              border: '1.8px solid #ccc',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={e => (e.target.style.borderColor = '#007BFF')}
            onBlur={e => (e.target.style.borderColor = '#ccc')}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              marginBottom: 24,
              padding: '14px 16px',
              fontSize: 16,
              borderRadius: 8,
              border: '1.8px solid #ccc',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={e => (e.target.style.borderColor = '#007BFF')}
            onBlur={e => (e.target.style.borderColor = '#ccc')}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: 16,
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#007BFF',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.2s',
            }}
            onMouseEnter={e => (e.target.style.backgroundColor = '#0056b3')}
            onMouseLeave={e => (e.target.style.backgroundColor = '#007BFF')}
            onMouseDown={e => (e.target.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.target.style.transform = 'scale(1)')}
          >
            Register
          </button>
        </form>

        {error && (
          <p
            style={{
              color: '#d93025',
              marginTop: 16,
              textAlign: 'center',
              fontWeight: '600',
            }}
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
