import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';


const Sidebar = ({ isOpen, toggleSidebar, handleLogout, navigate }) => {
  const baseBtn = {
    padding: '14px 18px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1.5px solid rgba(255, 255, 255, 0.15)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    width: 'calc(100% - 20px)',
    margin: '0 10px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderRadius: '10px',
    marginBottom: '8px',
  };

  const hoverStyle = {
    background: 'rgba(100, 181, 246, 0.2)',
    borderColor: '#64b5f6',
    transform: 'translateX(8px)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-300px',
        width: '300px',
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(80, 80, 80, 0.95) 0%, rgba(50, 50, 50, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        color: '#fff',
        transition: 'left 0.4s ease',
        paddingTop: '0',
        zIndex: '1000',
        boxShadow: '5px 0 30px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '25px 20px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#64b5f6' }}>🚗 CarWise</div>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            transition: 'transform 0.3s',
            padding: '5px',
          }}
          aria-label="Close sidebar"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(90deg)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0)')}
        >
          ✕
        </button>
      </div>

      {/* Navigation Items */}
      <div style={{ flex: 1, padding: '15px 0', overflowY: 'auto' }}>
        {[
          { label: '👤 Profile', route: '/profile' },
          { label: '🚘 My Cars', route: '/my-cars' },
          { label: '📤 Sell Your Car', route: '/sell' },
          { label: '❤️ Favorites', route: '/favorites' },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={() => {
              navigate(btn.route);
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

      {/* Logout Button */}
      <div style={{ padding: '15px 10px', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
        <button
          onClick={() => {
            handleLogout();
            toggleSidebar();
          }}
          style={{
            ...baseBtn,
            background: 'rgba(244, 67, 54, 0.2)',
            borderColor: '#ef5350',
            color: '#ffb4b4',
            marginBottom: '0',
          }}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, {
              background: 'rgba(244, 67, 54, 0.35)',
              borderColor: '#ef5350',
              transform: 'translateX(8px)',
            });
          }}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, baseBtn)}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
    const fetchCars = async () => {
      try {
        const response = await API.get('/cars');
        console.log('🚗 Fetched cars from database:', response.data);
        setCars(response.data);
      } catch (err) {
        console.error('❌ Failed to fetch cars:', err.message);
        // Fallback to localStorage
        const storedCars = JSON.parse(localStorage.getItem('cars')) || [];
        setCars(storedCars);
      }
    };
    
    fetchCars();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <p>Loading…</p>;

  
  const otherUsersCars = cars
    .filter((c) => c.ownerId !== user.id)
    .filter((c) => (filters.fuelType ? c.fuelType === filters.fuelType : true))
    .filter((c) => (filters.transmission ? c.transmission === filters.transmission : true))
    .filter((c) => (filters.ownership ? String(c.ownership) === filters.ownership : true))
    .filter((c) => (filters.seats ? String(c.seats) === filters.seats : true))
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleToggleFavorite = async (carId) => {
    try {
      await API.post(`/cars/${carId}/favorite`);
      // Refresh cars list to update favorite status
      const response = await API.get('/cars');
      setCars(response.data);
      console.log('❤️ Favorite toggled for car:', carId);
    } catch (err) {
      console.error('❌ Failed to toggle favorite:', err.message);
    }
  };

  // Pagination logic
  const itemsPerPage = 12;
  const totalPages = Math.ceil(otherUsersCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = otherUsersCars.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        navigate={navigate}
      />

      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow-x: hidden;
        }
      `}</style>
      
      <div
        style={{
          marginLeft: sidebarOpen ? 280 : 0,
          transition: 'margin-left 0.3s ease',
          height: '100vh',
          background: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/BG2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: '20px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {/* Menu Button */}
          <button
            onClick={toggleSidebar}
            style={{
              fontSize: 24,
              padding: '10px 16px',
              cursor: 'pointer',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#64b5f6',
              color: '#fff',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(100, 181, 246, 0.4)',
              transition: 'all 0.3s',
            }}
            aria-label="Toggle sidebar"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#42a5f5';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(100, 181, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#64b5f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(100, 181, 246, 0.4)';
            }}
          >
            ☰
          </button>

          <h1 style={{ 
            marginTop: '15px', 
            color: '#fff',
            fontSize: '2.2rem',
            fontWeight: 'bold',
            marginBottom: '25px',
          }}>
            Welcome,&nbsp;
            <span style={{ color: '#64b5f6' }}>{user.name || user.email}</span>! 🚗
          </h1>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="🔍 Search by car name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '350px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '14px',
              borderRadius: '10px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              transition: 'all 0.3s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#64b5f6';
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.boxShadow = '0 0 0 3px rgba(100, 181, 246, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
          
          <style>{`
            input::placeholder {
              color: rgba(255, 255, 255, 0.6);
            }
          `}</style>

          {/* Filters */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '30px',
            }}
          >
            <select 
              name="fuelType" 
              value={filters.fuelType} 
              onChange={handleFilterChange} 
              style={{
                ...selectStyle,
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                borderColor: 'rgba(100, 181, 246, 0.3)',
              }}
            >
              <option value="" style={{ background: '#333', color: '#fff' }}>All Fuel Types</option>
              <option value="Petrol" style={{ background: '#333', color: '#fff' }}>Petrol</option>
              <option value="Diesel" style={{ background: '#333', color: '#fff' }}>Diesel</option>
              <option value="Electric" style={{ background: '#333', color: '#fff' }}>Electric</option>
              <option value="CNG" style={{ background: '#333', color: '#fff' }}>CNG</option>
            </select>

            <select 
              name="transmission" 
              value={filters.transmission} 
              onChange={handleFilterChange} 
              style={{
                ...selectStyle,
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                borderColor: 'rgba(100, 181, 246, 0.3)',
              }}
            >
              <option value="" style={{ background: '#333', color: '#fff' }}>All Transmissions</option>
              <option value="Manual" style={{ background: '#333', color: '#fff' }}>Manual</option>
              <option value="Automatic" style={{ background: '#333', color: '#fff' }}>Automatic</option>
            </select>

            <select 
              name="ownership" 
              value={filters.ownership} 
              onChange={handleFilterChange} 
              style={{
                ...selectStyle,
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                borderColor: 'rgba(100, 181, 246, 0.3)',
              }}
            >
              <option value="" style={{ background: '#333', color: '#fff' }}>Any Ownership</option>
              <option value="1" style={{ background: '#333', color: '#fff' }}>1</option>
              <option value="2" style={{ background: '#333', color: '#fff' }}>2</option>
              <option value="3" style={{ background: '#333', color: '#fff' }}>3+</option>
            </select>

            <select 
              name="seats" 
              value={filters.seats} 
              onChange={handleFilterChange} 
              style={{
                ...selectStyle,
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                borderColor: 'rgba(100, 181, 246, 0.3)',
              }}
            >
              <option value="" style={{ background: '#333', color: '#fff' }}>Any Seats</option>
              <option value="2" style={{ background: '#333', color: '#fff' }}>2</option>
              <option value="4" style={{ background: '#333', color: '#fff' }}>4</option>
              <option value="5" style={{ background: '#333', color: '#fff' }}>5</option>
              <option value="7" style={{ background: '#333', color: '#fff' }}>7</option>
            </select>
          </div>

          {otherUsersCars.length === 0 && (
            <p style={{ 
              marginTop: '40px', 
              fontStyle: 'italic',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
            }}>
              No cars match the selected filters or search.
            </p>
          )}

          {/* Car Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            {paginatedCars.map((car) => {
              const isFavorited = car.favoriteBy && car.favoriteBy.includes(user?.email);
              
              return (
              <div
                key={car._id}
                onClick={() => navigate('/car-details', { state: car })}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '15px',
                  padding: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(100, 181, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(car._id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: isFavorited ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    border: isFavorited ? '2px solid #ff6b6b' : '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: isFavorited ? '#ff6b6b' : 'rgba(255, 255, 255, 0.6)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isFavorited ? 'rgba(255, 107, 107, 0.5)' : 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isFavorited ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorited ? '❤️' : '🤍'}
                </button>

                <img
                  src={
                    (car.photos && car.photos[0]) ||
                    car.photo ||
                    'https://via.placeholder.com/400x150?text=No+Image'
                  }
                  alt={car.name}
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginBottom: '12px',
                  }}
                />
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#64b5f6',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}>
                  🚗 {car.name}
                </h3>
                <p style={{ 
                  fontWeight: 'bold', 
                  color: '#90caf9',
                  margin: '6px 0',
                  fontSize: '1.05rem',
                }}>
                  ₹ {car.price}
                </p>
                <p style={{ 
                  fontSize: '0.9rem', 
                  marginTop: '6px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}>
                  📱 {car.ownerPhone}
                </p>
              </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
                marginTop: '40px',
                marginBottom: '20px',
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentPage === 1 ? 'rgba(100, 181, 246, 0.3)' : '#64b5f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = '#42a5f5';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentPage === 1 ? 'rgba(100, 181, 246, 0.3)' : '#64b5f6';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ← Previous
              </button>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: currentPage === page ? '#64b5f6' : 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      border: '1px solid rgba(100, 181, 246, 0.3)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: currentPage === page ? 'bold' : 'normal',
                      fontSize: '13px',
                      transition: 'all 0.3s',
                      minWidth: '36px',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page) {
                        e.currentTarget.style.backgroundColor = 'rgba(100, 181, 246, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentPage === totalPages ? 'rgba(100, 181, 246, 0.3)' : '#64b5f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = '#42a5f5';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentPage === totalPages ? 'rgba(100, 181, 246, 0.3)' : '#64b5f6';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Next →
              </button>
            </div>
          )}

          <div
            style={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {otherUsersCars.length > 0 && (
              <p>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, otherUsersCars.length)} of {otherUsersCars.length} cars
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


const selectStyle = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  minWidth: '140px',
  fontSize: '14px',
  transition: 'all 0.3s',
  cursor: 'pointer',
};

export default Dashboard;
