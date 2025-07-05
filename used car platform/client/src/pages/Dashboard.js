import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const Sidebar = ({ isOpen, toggleSidebar, handleLogout, navigate }) => {
  const baseBtn = {
    padding: '14px 20px',
    background: 'linear-gradient(to right, #212529, #343a40)',
    border: 'none',
    color: '#f8f9fa',
    fontSize: 17,
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%',
    borderBottom: '1px solid #495057',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const hoverStyle = {
    backgroundColor: '#495057',
    fontWeight: 'bold',
    transform: 'scale(1.04)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-240px',
        width: 240,
        height: '100%',
        backgroundColor: '#212529',
        color: '#fff',
        transition: 'left 0.3s ease',
        paddingTop: 60,
        zIndex: 1000,
        boxShadow: '2px 0 10px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          top: 10,
          right: -40,
          backgroundColor: '#212529',
          border: 'none',
          color: '#fff',
          fontSize: 30,
          cursor: 'pointer',
          width: 40,
          height: 40,
          borderRadius: '0 5px 5px 0',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.4)',
        }}
        aria-label="Close sidebar"
      >
        ×
      </button>

      {[
        { label: '👤 Profile', route: '/profile' },
        { label: '🚘 My Cars', route: '/my-cars' },
        { label: '📤 Sell Your Car', route: '/sell' },
        { label: '❤️ Favorites', route: '/favorites' },
        { label: '🚪 Logout', action: handleLogout },
      ].map((btn, idx) => (
        <button
          key={idx}
          onClick={() => {
            if (btn.action) btn.action();
            else navigate(btn.route);
            toggleSidebar();
          }}
          style={baseBtn}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, baseBtn)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState({
    fuelType: '',
    transmission: '',
    ownership: '',
    seats: '',
  });

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
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  
  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem('cars')) || [];
    setCars(storedCars);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <p>Loading…</p>;

  
  const otherUsersCars = cars
    .filter((c) => c.registeredEmail !== user.email)
    .filter((c) => (filters.fuelType ? c.fuelType === filters.fuelType : true))
    .filter((c) => (filters.transmission ? c.transmission === filters.transmission : true))
    .filter((c) => (filters.ownership ? String(c.ownership) === filters.ownership : true))
    .filter((c) => (filters.seats ? String(c.seats) === filters.seats : true))
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        navigate={navigate}
      />

      
      <div
        style={{
          marginLeft: sidebarOpen ? 240 : 0,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          backgroundImage: 'url("/BG2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: 30,
          backdropFilter: 'blur(2px)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          }}
        >
          
          <button
            onClick={toggleSidebar}
            style={{
              fontSize: 26,
              padding: '8px 14px',
              cursor: 'pointer',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#0d6efd',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(13,110,253,0.4)',
              transition: 'background-color 0.3s',
            }}
            aria-label="Toggle sidebar"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#084298')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0d6efd')}
          >
            ☰
          </button>

          <h1 style={{ marginTop: 10 }}>
            Welcome,&nbsp;
            <span style={{ color: '#0d6efd' }}>{user.name || user.email}</span>!
          </h1>

          
          <input
            type="text"
            placeholder="Search by car name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 320,
              padding: '11px 14px',
              marginTop: 24,
              marginBottom: 24,
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #ccc',
            }}
          />

          
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            <select name="fuelType" value={filters.fuelType} onChange={handleFilterChange} style={selectStyle}>
              <option value="">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="CNG">CNG</option>
            </select>

            <select name="transmission" value={filters.transmission} onChange={handleFilterChange} style={selectStyle}>
              <option value="">All Transmissions</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>

            <select name="ownership" value={filters.ownership} onChange={handleFilterChange} style={selectStyle}>
              <option value="">Any Ownership</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>

            <select name="seats" value={filters.seats} onChange={handleFilterChange} style={selectStyle}>
              <option value="">Any Seats</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="7">7</option>
            </select>
          </div>

          {otherUsersCars.length === 0 && (
            <p style={{ marginTop: 40, fontStyle: 'italic' }}>
              No cars match the selected filters or search.
            </p>
          )}

          
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              marginTop: 30,
              justifyContent: 'center',
            }}
          >
            {otherUsersCars.map((car) => (
              <div
                key={car.id}
                onClick={() => navigate('/car-details', { state: car })}
                style={{
                  flex: '1 1 260px',
                  background: '#fff',
                  borderRadius: 14,
                  padding: 22,
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={
                    (car.photos && car.photos[0]) ||
                    'https://via.placeholder.com/400x150?text=No+Image'
                  }
                  alt={car.name}
                  style={{
                    width: '100%',
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: 10,
                  }}
                />
                <h3 style={{ margin: '12px 0 6px', color: '#0d6efd' }}>🚗 {car.name}</h3>
                <p style={{ fontWeight: 600, color: '#007BFF' }}>{car.price}</p>
                <p style={{ fontSize: 14, marginTop: 4 }}>
                  <b>Owner Phone:</b> {car.ownerPhone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};


const selectStyle = {
  padding: '9px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  minWidth: 150,
  fontSize: 15,
};

export default Dashboard;
