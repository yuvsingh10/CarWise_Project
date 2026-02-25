import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError('All fields are required');
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.phone.length !== 10 || !/^\d+$/.test(form.phone)) {
      setError('Phone must be exactly 10 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      setLoading(false);
      alert('Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/BG.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .form-container {
          animation: slideInUp 0.6s ease-out;
        }
        .error-shake {
          animation: shake 0.3s ease-in-out;
        }
        input:focus {
          outline: none;
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <div
        className="form-container"
        style={{
          maxWidth: 320,
          width: '100%',
          padding: '15px 20px',
          borderRadius: '15px',
          background: 'rgba(0, 0, 0, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          aria-label="Back to Home"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '20px',
            padding: 0,
            transition: 'transform 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => (e.target.style.transform = 'scale(1.2)')}
          onMouseLeave={e => (e.target.style.transform = 'scale(1)')}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 10 }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            color: '#fff', 
            margin: '0 0 5px 0',
            fontWeight: '900',
          }}>
            Create Account
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '0.85rem',
            margin: 0,
          }}>
            Join CarWise
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={error ? 'error-shake' : ''}
            style={{
              background: 'rgba(255, 107, 107, 0.15)',
              border: '1px solid #ff6b6b',
              color: '#ffb4b4',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontWeight: '500',
              fontSize: '0.85rem',
            }}
            role="alert"
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Input */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              color: '#fff',
              fontWeight: '600',
              fontSize: '0.85rem',
            }}>
              👤 Full Name
            </label>
            <input
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.9rem',
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ffd54f';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 213, 79, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              color: '#fff',
              fontWeight: '600',
              fontSize: '0.85rem',
            }}>
              📧 Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.9rem',
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ffd54f';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 213, 79, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              color: '#fff',
              fontWeight: '600',
              fontSize: '0.85rem',
            }}>
              🔒 Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.9rem',
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ffd54f';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 213, 79, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <small style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', display: 'block', fontSize: '0.8rem' }}>
              {form.password.length > 0 && form.password.length < 6 
                ? '❌ Too short' 
                : form.password.length >= 6 
                ? '✅ Strong' 
                : ''}
            </small>
          </div>

          {/* Phone Input */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              color: '#fff',
              fontWeight: '600',
              fontSize: '0.85rem',
            }}>
              📱 Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="10-digit phone number"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.9rem',
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ffd54f';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 213, 79, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <small style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', display: 'block', fontSize: '0.8rem' }}>
              {form.phone.length > 0 && form.phone.length < 10 
                ? '❌ Must be 10 digits' 
                : form.phone.length === 10 && /^\d+$/.test(form.phone)
                ? '✅ Valid' 
                : ''}
            </small>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#222',
              background: '#ffd54f',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(255, 213, 79, 0.4)',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 35px rgba(255, 213, 79, 0.6)';
                e.target.style.backgroundColor = '#ffca28';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px rgba(255, 213, 79, 0.4)';
                e.target.style.backgroundColor = '#ffd54f';
              }
            }}
            onMouseDown={(e) => {
              if (!loading) e.target.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              if (!loading) e.target.style.transform = 'translateY(-3px)';
            }}
          >
            {loading ? '⏳ Creating...' : '✨ Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '12px 0',
          color: 'rgba(255, 255, 255, 0.6)',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
        </div>

        {/* Login Link */}
        <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '0.9rem' }}>
          Have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#ffd54f',
              textDecoration: 'none',
              fontWeight: '700',
              transition: 'color 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#ffca28')}
            onMouseLeave={(e) => (e.target.style.color = '#ffd54f')}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
