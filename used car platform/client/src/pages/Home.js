import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Feature cards for logged-in users
  const features = [
    { icon: '🚗', title: 'Browse Cars', desc: 'Explore thousands of quality used cars' },
    { icon: '📤', title: 'Sell Your Car', desc: 'List your car in minutes with photos' },
    { icon: '❤️', title: 'Favorites', desc: 'Save your favorite listings' },
    { icon: '📋', title: 'Manage Cars', desc: 'Edit or delete your listings' },
  ];

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/BG.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      overflow: user ? 'auto' : 'hidden',
    }}>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .hero-title {
          animation: fadeInDown 0.8s ease-out;
        }
        .hero-subtitle {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        .hero-button {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }
        .feature-card {
          animation: fadeInUp 0.6s ease-out;
        }
        .floating {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <h1 style={{ color: '#fff', fontSize: '1.8rem', margin: 0, fontWeight: '800' }}>
          🚗 CarWise
        </h1>
        {user && (
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 25px',
              backgroundColor: '#ff6b6b',
              color: '#fff',
              border: 'none',
              borderRadius: '25px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = '#ff5252';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#ff6b6b';
            }}
          >
            Logout
          </button>
        )}
      </nav>

      {/* Hero Section */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >

        <div style={{ zIndex: 10, maxWidth: '800px', paddingX: '20px' }}>
          <div className="hero-title" style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '5rem' }} className="floating">
              🚗
            </span>
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              fontWeight: '900',
              marginBottom: '20px',
              letterSpacing: '-2px',
              lineHeight: '1.2',
            }}
          >
            Find Your Dream Car
          </h1>

          <p
            className="hero-subtitle"
            style={{
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              marginBottom: '40px',
              opacity: 0.95,
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 40px',
            }}
          >
            {user
              ? `Welcome back, ${user.name}! Explore amazing deals and manage your listings.`
              : 'Buy, sell, and manage used cars with ease. Join thousands of happy customers.'}
          </p>

          {user ? (
            <div className="hero-button" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/dashboard"
                style={{
                  padding: '16px 45px',
                  backgroundColor: '#ffd54f',
                  color: '#222',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  boxShadow: '0 10px 30px rgba(255, 213, 79, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 213, 79, 0.6)';
                  e.currentTarget.style.backgroundColor = '#ffca28';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 213, 79, 0.4)';
                  e.currentTarget.style.backgroundColor = '#ffd54f';
                }}
              >
                📊 Go to Dashboard
              </Link>
              <Link
                to="/my-cars"
                style={{
                  padding: '16px 45px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                }}
              >
                📋 My Cars
              </Link>
            </div>
          ) : (
            <div className="hero-button" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/login"
                style={{
                  padding: '16px 45px',
                  backgroundColor: '#ffd54f',
                  color: '#222',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  boxShadow: '0 10px 30px rgba(255, 213, 79, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 213, 79, 0.6)';
                  e.currentTarget.style.backgroundColor = '#ffca28';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 213, 79, 0.4)';
                  e.currentTarget.style.backgroundColor = '#ffd54f';
                }}
              >
                🔓 Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '16px 45px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                }}
              >
                ✍️ Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section (for logged-in users) */}
      {user && (
        <div
          style={{
            padding: '60px 20px 40px 20px',
            background: 'rgba(0, 0, 0, 0.9)',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2
              style={{
                fontSize: '3rem',
                fontWeight: '900',
                marginBottom: '60px',
                color: '#fff',
              }}
            >
              ✨ Explore Our Features
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px',
              }}
            >
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="feature-card"
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    padding: '40px 30px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 213, 79, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 213, 79, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255, 213, 79, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#fff' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem' }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
