import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const MyCars = () => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch all cars from API
    fetch('http://localhost:5000/api/cars', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCars(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching cars:', err);
        setCars([]);
      });
  }, []);

  if (!user) return <p>Loading…</p>;

  const myCars = cars.filter(car => car.ownerId === user.id);

  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/BG2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1000,
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: 20,
          padding: 35,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 20,
            padding: '10px 20px',
            backgroundColor: '#64b5f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#42a5f5';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#64b5f6';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Back
        </button>

        <h1 style={{ textAlign: 'center', color: '#64b5f6', fontSize: '2rem', fontWeight: '900' }}>My Cars for Sale</h1>
        {myCars.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255, 255, 255, 0.8)' }}>You haven't listed any cars yet.</p>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            marginTop: 25,
            justifyContent: 'center',
          }}
        >
          {myCars.map((car) => (
            <div
              key={car.id}
              onClick={() => navigate('/car-details', { state: car })}
              style={{
                flex: '1 1 250px',
                background: 'transparent',
                borderRadius: 12,
                padding: 20,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <img
                src={(car.photos && car.photos[0]) || 'https://via.placeholder.com/400x150?text=No+Image'}
                alt={car.name}
                style={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
              <h3 style={{ margin: '10px 0', color: '#64b5f6', fontWeight: '700' }}>🚗 {car.name}</h3>
              <p style={{ fontWeight: 600, color: '#90caf9', fontSize: '16px' }}>{car.price}</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}><b style={{ color: '#64b5f6' }}>Phone:</b> {car.ownerPhone}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/edit-car', { state: car });
                }}
                style={{
                  marginTop: 8,
                  padding: '8px 14px',
                  background: '#64b5f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  marginRight: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#42a5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#64b5f6';
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const confirmed = window.confirm('Are you sure you want to delete this car?');
                  if (!confirmed) return;
                  const updatedCars = cars.filter(c => c.id !== car.id);
                  setCars(updatedCars);
                  localStorage.setItem('cars', JSON.stringify(updatedCars));
                }}
                style={{
                  marginTop: 8,
                  padding: '8px 14px',
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef5350';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f44336';
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCars;
