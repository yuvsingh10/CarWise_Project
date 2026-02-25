import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Favorites = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await API.get('/cars/favorites');
        console.log('❤️ Fetched favorites from database:', response.data);
        setCars(response.data);
      } catch (err) {
        console.error('❌ Failed to fetch favorites:', err.message);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleRemoveFavorite = async (carId) => {
    try {
      await API.post(`/cars/${carId}/favorite`);
      // Remove from local state
      setCars(cars.filter(car => car._id !== carId));
      console.log('❤️ Car removed from favorites');
    } catch (err) {
      console.error('❌ Failed to remove favorite:', err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/BG2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: cars.length === 0 ? 'center' : 'flex-start',
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            color: '#fff',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            textShadow: '0 0 5px rgba(0,0,0,0.7)',
          }}
        >
          <h2>Loading Favorites...</h2>
        </div>
      ) : cars.length === 0 ? (
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
              padding: '12px 28px',
              backgroundColor: '#64b5f6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '700',
              marginTop: 20,
              fontSize: 16,
              boxShadow: '0 4px 15px rgba(100, 181, 246, 0.6)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#42a5f5')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#64b5f6')}
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div
          style={{
            maxWidth: 960,
            width: '100%',
            padding: 35,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            minHeight: '80vh',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#64b5f6', fontWeight: '900', fontSize: '1.8rem' }}>
            ❤️ Your Favorite Cars ({cars.length})
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
              const photo = car.photo || 'https://via.placeholder.com/400x150?text=No+Image';

              return (
                <div
                  key={car._id}
                  style={{
                    flex: '1 1 260px',
                    background: 'rgba(100, 181, 246, 0.08)',
                    border: '2px solid rgba(100, 181, 246, 0.2)',
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.background = 'rgba(100, 181, 246, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(100, 181, 246, 0.08)';
                  }}
                >
                  <img
                    src={photo}
                    alt={car.name}
                    onClick={() => navigate('/car-details', { state: car })}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 12, cursor: 'pointer' }}
                  />
                  <h3 style={{ margin: '8px 0', color: '#64b5f6', fontWeight: '700' }}>🚗 {car.name}</h3>
                  <p style={{ fontWeight: 600, color: '#90caf9', fontSize: 18, margin: '8px 0' }}>₹{car.price}</p>
                  <p style={{ color: '#64b5f6', fontSize: '0.9rem', margin: '4px 0' }}>{car.modelYear} • {car.fuelType}</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
                    <button
                      onClick={() => navigate('/car-details', { state: car })}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#64b5f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        transition: 'background 0.3s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#42a5f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#64b5f6')}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(car._id)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: 'rgba(255, 107, 107, 0.2)',
                        color: '#ffb4b4',
                        border: '1px solid #ff6b6b',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        transition: 'background 0.3s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 107, 107, 0.35)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)')}
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '12px 28px',
                backgroundColor: '#64b5f6',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: 16,
                boxShadow: '0 5px 15px rgba(100, 181, 246, 0.6)',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#42a5f5')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#64b5f6')}
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
