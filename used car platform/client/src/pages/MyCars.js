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
    const storedCars = JSON.parse(localStorage.getItem('cars')) || [];
    setCars(storedCars);
  }, []);

  if (!user) return <p>Loading…</p>;

  const myCars = cars.filter(car => car.registeredEmail === user.email);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/BG2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1000,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 16,
          padding: 30,
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 20,
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Back
        </button>

        <h1 style={{ textAlign: 'center', color: '#007BFF' }}>My Cars for Sale</h1>
        {myCars.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: 20 }}>You haven't listed any cars yet.</p>
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
                background: '#fff',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                textAlign: 'center',
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
              <h3 style={{ margin: '10px 0' }}>🚗 {car.name}</h3>
              <p style={{ fontWeight: 600, color: '#007BFF' }}>{car.price}</p>
              <p><b>Registered Email:</b> {car.registeredEmail}</p>
              <p><b>Owner Phone:</b> {car.ownerPhone}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/edit-car', { state: car });
                }}
                style={{
                  marginTop: 8,
                  padding: '6px 12px',
                  background: '#ffc107',
                  border: 'none',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  marginRight: 6,
                }}
              >
                Edit
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
                  padding: '6px 12px',
                  background: '#dc3545',
                  border: 'none',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCars;
