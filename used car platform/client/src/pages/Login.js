import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              marginBottom: 16,
              padding: '14px 16px',
              fontSize: 16,
              borderRadius: 8,
              border: '1.8px solid #ccc',
              outline: 'none',
              backgroundColor: '#f8f9fa',
              transition: 'border-color 0.3s, box-shadow 0.2s',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#007BFF';
              e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.2)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#ccc';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              marginBottom: 24,
              padding: '14px 16px',
              fontSize: 16,
              borderRadius: 8,
              border: '1.8px solid #ccc',
              outline: 'none',
              backgroundColor: '#f8f9fa',
              transition: 'border-color 0.3s, box-shadow 0.2s',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#007BFF';
              e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.2)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#ccc';
              e.target.style.boxShadow = 'none';
            }}
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
              boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
            }}
            onMouseEnter={e => (e.target.style.backgroundColor = '#0056b3')}
            onMouseLeave={e => (e.target.style.backgroundColor = '#007BFF')}
            onMouseDown={e => (e.target.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.target.style.transform = 'scale(1)')}
          >
            Login
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

export default Login;
