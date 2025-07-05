import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);

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

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/BG.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 20px',
        color: '#fff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Overlay for subtle dark filter */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 50, 0.6)',
          zIndex: 0,
          backdropFilter: 'brightness(0.7)',
        }}
      />

      <h1
        style={{
          fontSize: '4rem',
          fontWeight: '900',
          letterSpacing: '4px',
          zIndex: 10,
          textShadow: '0 0 15px #ffd54f',
          marginBottom: '15px',
          fontFamily: "'Poppins', sans-serif",
          userSelect: 'none',
        }}
      >
        CarWise
      </h1>

      {user ? (
        <>
          <h2
            style={{
              fontWeight: '700',
              fontSize: '2.4rem',
              marginTop: '10px',
              color: '#ffd54f',
              zIndex: 10,
              textShadow: '0 0 6px #ffd54f',
            }}
          >
            Welcome back, <span style={{ color: '#fff' }}>{user.name || 'User'}</span>!
          </h2>
          <p
            style={{
              fontSize: '1.3rem',
              marginTop: '12px',
              maxWidth: '500px',
              lineHeight: '1.6',
              zIndex: 10,
              textShadow: '0 0 4px rgba(0,0,0,0.4)',
            }}
          >
            Explore the best deals, manage your listings, and find your perfect car easily.
          </p>
          <Link
            to="/dashboard"
            style={{
              marginTop: '40px',
              padding: '16px 50px',
              backgroundColor: '#ffd54f',
              color: '#333',
              fontWeight: '700',
              fontSize: '1.2rem',
              borderRadius: '35px',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(255, 213, 79, 0.7)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              zIndex: 10,
              display: 'inline-block',
              userSelect: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffca28';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 213, 79, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffd54f';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 213, 79, 0.7)';
            }}
          >
            Go to Dashboard
          </Link>
        </>
      ) : (
        <>
          <p
            style={{
              fontSize: '1.4rem',
              marginTop: '30px',
              maxWidth: '420px',
              lineHeight: '1.7',
              zIndex: 10,
              textShadow: '0 0 5px rgba(0,0,0,0.5)',
            }}
          >
            Please login or register to start your journey with us.
          </p>
          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              gap: '25px',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <Link
              to="/login"
              style={{
                padding: '14px 38px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#764ba2',
                fontWeight: '700',
                fontSize: '1.1rem',
                borderRadius: '28px',
                textDecoration: 'none',
                boxShadow: '0 6px 18px rgba(118, 75, 162, 0.4)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                userSelect: 'none',
                flex: '1 0 auto',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                padding: '14px 38px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#764ba2',
                fontWeight: '700',
                fontSize: '1.1rem',
                borderRadius: '28px',
                textDecoration: 'none',
                boxShadow: '0 6px 18px rgba(118, 75, 162, 0.4)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                userSelect: 'none',
                flex: '1 0 auto',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Register
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
