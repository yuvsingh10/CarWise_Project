import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Users management
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);

  // Cars management
  const [cars, setCars] = useState([]);
  const [carSearch, setCarSearch] = useState('');
  const [carFilter, setCarFilter] = useState('all');
  const [carsPage, setCarsPage] = useState(1);
  const [carsTotalPages, setCarsTotalPages] = useState(1);

  // Analytics
  const [analytics, setAnalytics] = useState(null);

  // Modals
  const [suspendModal, setSuspendModal] = useState({ open: false, userId: null });
  const [removeModal, setRemoveModal] = useState({ open: false, carId: null });
  const [suspendReason, setSuspendReason] = useState('');
  const [removeReason, setRemoveReason] = useState('');

  // Fetch users
  const fetchUsers = async (page = 1, search = '', filter = 'all') => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filter === 'suspended') params.suspended = true;
      else if (filter === 'active') params.suspended = false;

      const response = await api.get('/admin/users', { params });
      setUsers(response.data.users);
      setUsersTotalPages(response.data.pagination.totalPages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars
  const fetchCars = async (page = 1, search = '', filter = 'all') => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filter === 'removed') params.removed = true;
      else if (filter === 'active') params.removed = false;

      const response = await api.get('/admin/cars', { params });
      setCars(response.data.cars);
      setCarsTotalPages(response.data.pagination.totalPages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  // Suspend user
  const handleSuspendUser = async () => {
    if (!suspendReason.trim()) {
      alert('Please provide a suspension reason');
      return;
    }
    try {
      await api.put(`/admin/users/${suspendModal.userId}/suspend`, { reason: suspendReason });
      setSuspendReason('');
      setSuspendModal({ open: false, userId: null });
      fetchUsers(usersPage, userSearch, userFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to suspend user');
    }
  };

  // Unsuspend user
  const handleUnsuspendUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/unsuspend`, {});
      fetchUsers(usersPage, userSearch, userFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unsuspend user');
    }
  };

  // Remove car
  const handleRemoveCar = async () => {
    if (!removeReason.trim()) {
      alert('Please provide a removal reason');
      return;
    }
    try {
      await api.put(`/admin/cars/${removeModal.carId}/remove`, { reason: removeReason });
      setRemoveReason('');
      setRemoveModal({ open: false, carId: null });
      fetchCars(carsPage, carSearch, carFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove car');
    }
  };

  // Restore car
  const handleRestoreCar = async (carId) => {
    try {
      await api.put(`/admin/cars/${carId}/restore`, {});
      fetchCars(carsPage, carSearch, carFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to restore car');
    }
  };

  // Initial fetch based on tab
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(usersPage, userSearch, userFilter);
    } else if (activeTab === 'cars') {
      fetchCars(carsPage, carSearch, carFilter);
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const tabStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #64b5f6',
  };

  const tabButtonStyle = (active) => ({
    padding: '12px 20px',
    border: 'none',
    background: active ? '#64b5f6' : 'transparent',
    color: active ? '#fff' : '#666',
    cursor: 'pointer',
    fontWeight: active ? 'bold' : 'normal',
    fontSize: '14px',
    borderRadius: '8px 8px 0 0',
    transition: 'all 0.3s',
    borderBottom: active ? '3px solid #4a90e2' : 'none',
  });

  const cardStyle = {
    background: '#f5f5f5',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  };

  const buttonStyle = (danger = false) => ({
    padding: '8px 15px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    background: danger ? '#e74c3c' : '#64b5f6',
    color: '#fff',
    marginRight: '8px',
    transition: 'all 0.3s',
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>📊 Admin Dashboard</h1>

      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #f99'
        }}>
          {error}
        </div>
      )}

      <div style={tabStyle}>
        <button
          style={tabButtonStyle(activeTab === 'users')}
          onClick={() => handleTabChange('users')}
        >
          👥 Users ({users.length})
        </button>
        <button
          style={tabButtonStyle(activeTab === 'cars')}
          onClick={() => handleTabChange('cars')}
        >
          🚗 Cars ({cars.length})
        </button>
        <button
          style={tabButtonStyle(activeTab === 'analytics')}
          onClick={() => handleTabChange('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setUsersPage(1);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') fetchUsers(1, e.target.value, userFilter);
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            />
            <select
              value={userFilter}
              onChange={(e) => {
                setUserFilter(e.target.value);
                setUsersPage(1);
              }}
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
          ) : (
            <>
              {users.map((user) => (
                <div key={user._id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{user.name}</h4>
                      <p style={{ margin: '0 0 3px 0', fontSize: '13px', color: '#666' }}>
                        📧 {user.email}
                      </p>
                      <p style={{ margin: '0 0 3px 0', fontSize: '13px', color: '#666' }}>
                        📱 {user.phone || 'N/A'}
                      </p>
                      {user.isSuspended && (
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#e74c3c', fontWeight: 'bold' }}>
                          ⛔ SUSPENDED: {user.suspensionReason}
                        </p>
                      )}
                    </div>
                    <div>
                      {user.isSuspended ? (
                        <button
                          style={buttonStyle()}
                          onClick={() => handleUnsuspendUser(user._id)}
                        >
                          ✅ Unsuspend
                        </button>
                      ) : (
                        <button
                          style={buttonStyle(true)}
                          onClick={() => setSuspendModal({ open: true, userId: user._id })}
                        >
                          🔒 Suspend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {usersTotalPages > 1 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    onClick={() => { setUsersPage(Math.max(1, usersPage - 1)); fetchUsers(Math.max(1, usersPage - 1), userSearch, userFilter); }}
                    style={buttonStyle()}
                    disabled={usersPage === 1}
                  >
                    ← Previous
                  </button>
                  <span style={{ margin: '0 15px', color: '#666' }}>Page {usersPage} of {usersTotalPages}</span>
                  <button
                    onClick={() => { setUsersPage(Math.min(usersTotalPages, usersPage + 1)); fetchUsers(Math.min(usersTotalPages, usersPage + 1), userSearch, userFilter); }}
                    style={buttonStyle()}
                    disabled={usersPage === usersTotalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Cars Tab */}
      {activeTab === 'cars' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search cars..."
              value={carSearch}
              onChange={(e) => {
                setCarSearch(e.target.value);
                setCarsPage(1);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') fetchCars(1, e.target.value, carFilter);
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            />
            <select
              value={carFilter}
              onChange={(e) => {
                setCarFilter(e.target.value);
                setCarsPage(1);
              }}
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Cars</option>
              <option value="active">Active</option>
              <option value="removed">Removed</option>
            </select>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
          ) : (
            <>
              {cars.map((car) => (
                <div key={car._id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{car.name}</h4>
                      <p style={{ margin: '0 0 3px 0', fontSize: '13px', color: '#666' }}>
                        💰 ₹{car.price?.toLocaleString()} | 🏭 {car.fuelType} | ⚙️ {car.transmission}
                      </p>
                      <p style={{ margin: '0 0 3px 0', fontSize: '13px', color: '#666' }}>
                        👤 {car.ownerId?.name} ({car.ownerId?.email})
                      </p>
                      <p style={{ margin: '0 0 3px 0', fontSize: '13px', color: '#666' }}>
                        📝 {car.description?.substring(0, 100)}...
                      </p>
                      {car.isRemoved && (
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#e74c3c', fontWeight: 'bold' }}>
                          🚫 REMOVED: {car.removalReason}
                        </p>
                      )}
                    </div>
                    <div>
                      {car.isRemoved ? (
                        <button
                          style={buttonStyle()}
                          onClick={() => handleRestoreCar(car._id)}
                        >
                          ♻️ Restore
                        </button>
                      ) : (
                        <button
                          style={buttonStyle(true)}
                          onClick={() => setRemoveModal({ open: true, carId: car._id })}
                        >
                          🗑️ Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {carsTotalPages > 1 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    onClick={() => { setCarsPage(Math.max(1, carsPage - 1)); fetchCars(Math.max(1, carsPage - 1), carSearch, carFilter); }}
                    style={buttonStyle()}
                    disabled={carsPage === 1}
                  >
                    ← Previous
                  </button>
                  <span style={{ margin: '0 15px', color: '#666' }}>Page {carsPage} of {carsTotalPages}</span>
                  <button
                    onClick={() => { setCarsPage(Math.min(carsTotalPages, carsPage + 1)); fetchCars(Math.min(carsTotalPages, carsPage + 1), carSearch, carFilter); }}
                    style={buttonStyle()}
                    disabled={carsPage === carsTotalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
          ) : analytics ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                {/* Users Stats */}
                <div style={{ ...cardStyle, background: '#e3f2fd' }}>
                  <h3 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>👥 Users</h3>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Total: <strong>{analytics.users.total}</strong></p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Active: <strong style={{ color: '#27ae60' }}>{analytics.users.active}</strong></p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Suspended: <strong style={{ color: '#e74c3c' }}>{analytics.users.suspended}</strong></p>
                </div>

                {/* Cars Stats */}
                <div style={{ ...cardStyle, background: '#f3e5f5' }}>
                  <h3 style={{ color: '#7b1fa2', margin: '0 0 10px 0' }}>🚗 Cars</h3>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Total: <strong>{analytics.cars.total}</strong></p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Active: <strong style={{ color: '#27ae60' }}>{analytics.cars.active}</strong></p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Removed: <strong style={{ color: '#e74c3c' }}>{analytics.cars.removed}</strong></p>
                </div>

                {/* Pricing Stats */}
                <div style={{ ...cardStyle, background: '#e8f5e9' }}>
                  <h3 style={{ color: '#388e3c', margin: '0 0 10px 0' }}>💰 Pricing</h3>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Avg: <strong>₹{analytics.pricing.average?.toLocaleString()}</strong></p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Min: <strong>₹{analytics.pricing.minimum?.toLocaleString()}</strong></p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Max: <strong>₹{analytics.pricing.maximum?.toLocaleString()}</strong></p>
                </div>
              </div>

              {/* Cars by Fuel Type */}
              {analytics.carsByFuelType.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ color: '#333', margin: '0 0 15px 0' }}>⛽ Cars by Fuel Type</h3>
                  {analytics.carsByFuelType.map((fuel) => (
                    <div key={fuel._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ddd' }}>
                      <span>{fuel._id || 'Unknown'}</span>
                      <strong>{fuel.count} cars</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Activity */}
              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {/* Recent Users */}
                <div style={cardStyle}>
                  <h3 style={{ color: '#333', margin: '0 0 15px 0' }}>📝 Recent Users</h3>
                  {analytics.recentActivity.users.map((user) => (
                    <div key={user._id} style={{ padding: '8px 0', borderBottom: '1px solid #ddd', fontSize: '13px' }}>
                      <p style={{ margin: '0' }}><strong>{user.name}</strong></p>
                      <p style={{ margin: '0', color: '#666' }}>{user.email}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Cars */}
                <div style={cardStyle}>
                  <h3 style={{ color: '#333', margin: '0 0 15px 0' }}>🚗 Recent Cars</h3>
                  {analytics.recentActivity.cars.map((car) => (
                    <div key={car._id} style={{ padding: '8px 0', borderBottom: '1px solid #ddd', fontSize: '13px' }}>
                      <p style={{ margin: '0' }}><strong>{car.name}</strong></p>
                      <p style={{ margin: '0', color: '#666' }}>₹{car.price?.toLocaleString()} by {car.ownerId?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No analytics data available</p>
          )}
        </div>
      )}

      {/* Suspend Modal */}
      {suspendModal.open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#e74c3c' }}>🔒 Suspend User</h3>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>Please provide a reason for suspending this user:</p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Reason for suspension..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                minHeight: '100px',
                boxSizing: 'border-box',
                marginBottom: '15px'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSuspendModal({ open: false, userId: null })}
                style={{
                  ...buttonStyle(),
                  background: '#999'
                }}
              >
                ✕ Cancel
              </button>
              <button
                onClick={handleSuspendUser}
                style={buttonStyle(true)}
              >
                ✓ Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Car Modal */}
      {removeModal.open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#e74c3c' }}>🗑️ Remove Car Listing</h3>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>Please provide a reason for removing this listing:</p>
            <textarea
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              placeholder="Reason for removal..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                minHeight: '100px',
                boxSizing: 'border-box',
                marginBottom: '15px'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setRemoveModal({ open: false, carId: null })}
                style={{
                  ...buttonStyle(),
                  background: '#999'
                }}
              >
                ✕ Cancel
              </button>
              <button
                onClick={handleRemoveCar}
                style={buttonStyle(true)}
              >
                ✓ Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
