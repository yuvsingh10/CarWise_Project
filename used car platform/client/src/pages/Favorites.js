import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  const getUserEmail = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'guest';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || 'guest';
    } catch {
      return 'guest';
    }
  };

  const userEmail = getUserEmail();

  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem('cars')) || [];
    const favoritesRaw = localStorage.getItem('favorites');
    let favoritesObj = {};
    if (favoritesRaw) {
      try {
        favoritesObj = JSON.parse(favoritesRaw);
      } catch {}
    }
    const likedIds = favoritesObj[userEmail] || [];
    const likedCars = storedCars.filter(car => likedIds.includes(car.id));
    setCars(likedCars);
    setFavorites(likedIds);
  }, [userEmail]);

  
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url("/BG2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: cars.length === 0 ? 'center' : 'flex-start',
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      {cars.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            color: '#fff',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            textShadow: '0 0 5px rgba(0,0,0,0.7)',
          }}
        >
          <h2>Your Favorite Cars</h2>
          <p>You haven't liked any cars yet.</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0d6efd',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: 20,
              fontSize: 16,
              boxShadow: '0 4px 12px rgba(13,110,253,0.6)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#084298')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0d6efd')}
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div
          style={{
            maxWidth: 960,
            width: '100%',
            padding: 30,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 16,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            minHeight: '80vh',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#007BFF', fontWeight: '700' }}>
            Your Favorite Cars
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              justifyContent: 'center',
            }}
          >
            {cars.map((car) => {
              const photo =
                (car.photos && car.photos.length > 0 && car.photos[0]) ||
                car.photo ||
                'https://via.placeholder.com/400x150?text=No+Image';

              return (
                <div
                  key={car.id}
                  onClick={() => navigate('/car-details', { state: car })}
                  style={{
                    flex: '1 1 260px',
                    background: '#fff',
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <img
                    src={photo}
                    alt={car.name}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }}
                  />
                  <h3 style={{ margin: '8px 0', color: '#0d6efd' }}>🚗 {car.name}</h3>
                  <p style={{ fontWeight: 600, color: '#007BFF', fontSize: 18 }}>{car.price}</p>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '12px 28px',
                backgroundColor: '#0d6efd',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: 16,
                boxShadow: '0 5px 15px rgba(13,110,253,0.6)',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#084298')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0d6efd')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
