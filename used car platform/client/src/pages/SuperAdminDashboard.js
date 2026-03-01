import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SuperAdminDashboard = () => {
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

  // Admins management
  const [admins, setAdmins] = useState([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState('all');
  const [adminsPage, setAdminsPage] = useState(1);
  const [adminsTotalPages, setAdminsTotalPages] = useState(1);
  const [createAdminModal, setCreateAdminModal] = useState({ open: false });
  const [newAdminData, setNewAdminData] = useState({ name: '', email: '', password: '' });
  const [deleteAdminModal, setDeleteAdminModal] = useState({ open: false, adminId: null });
  const [permanentDeleteAdminModal, setPermanentDeleteAdminModal] = useState({ open: false, adminId: null });

  // Analytics
  const [analytics, setAnalytics] = useState(null);

  // Modals
  const [suspendModal, setSuspendModal] = useState({ open: false, userId: null });
  const [removeModal, setRemoveModal] = useState({ open: false, carId: null });
  const [permanentDeleteUserModal, setPermanentDeleteUserModal] = useState({ open: false, userId: null });
  const [permanentDeleteCarModal, setPermanentDeleteCarModal] = useState({ open: false, carId: null });
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

  // Fetch admins
  const fetchAdmins = async (page = 1, search = '', filter = 'all') => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filter === 'active') params.isActive = true;
      else if (filter === 'inactive') params.isActive = false;

      const response = await api.get('/admin-auth/all', { params });
      setAdmins(Array.isArray(response.data) ? response.data : response.data.admins || []);
      setAdminsTotalPages(response.data?.pagination?.totalPages || 1);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admins');
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

  // Create admin
  const handleCreateAdmin = async () => {
    if (!newAdminData.name.trim()) {
      alert('Please enter admin name');
      return;
    }
    if (!newAdminData.email.trim()) {
      alert('Please enter admin email');
      return;
    }
    if (!newAdminData.password.trim()) {
      alert('Please enter admin password');
      return;
    }

    try {
      await api.post('/admin-auth/register', {
        name: newAdminData.name,
        email: newAdminData.email,
        password: newAdminData.password,
      });
      alert('✅ Admin created successfully!');
      setNewAdminData({ name: '', email: '', password: '' });
      setCreateAdminModal({ open: false });
      fetchAdmins(adminsPage, adminSearch, adminFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create admin');
    }
  };

  // Delete admin
  const handleDeleteAdmin = async () => {
    if (!deleteAdminModal.adminId) return;
    try {
      await api.delete(`/admin-auth/${deleteAdminModal.adminId}`);
      alert('✅ Admin disabled successfully!');
      setDeleteAdminModal({ open: false, adminId: null });
      fetchAdmins(adminsPage, adminSearch, adminFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to disable admin');
    }
  };

  // Permanently delete admin
  const handlePermanentlyDeleteAdmin = async () => {
    if (!permanentDeleteAdminModal.adminId) return;
    try {
      await api.delete(`/admin-auth/${permanentDeleteAdminModal.adminId}/permanent`);
      alert('✅ Admin permanently deleted from the system!');
      setPermanentDeleteAdminModal({ open: false, adminId: null });
      fetchAdmins(adminsPage, adminSearch, adminFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to permanently delete admin');
    }
  };

  // Restore admin
  const handleRestoreAdmin = async (adminId) => {
    try {
      await api.put(`/admin-auth/${adminId}/restore`, {});
      alert('✅ Admin restored successfully!');
      fetchAdmins(adminsPage, adminSearch, adminFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to restore admin');
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

  // Permanently delete user
  const handlePermanentlyDeleteUser = async () => {
    if (!permanentDeleteUserModal.userId) return;
    try {
      await api.delete(`/admin/users/${permanentDeleteUserModal.userId}/permanent`);
      alert('✅ User permanently deleted from the system!');
      setPermanentDeleteUserModal({ open: false, userId: null });
      fetchUsers(usersPage, userSearch, userFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to permanently delete user');
    }
  };

  // Permanently delete car
  const handlePermanentlyDeleteCar = async () => {
    if (!permanentDeleteCarModal.carId) return;
    try {
      await api.delete(`/admin/cars/${permanentDeleteCarModal.carId}/permanent`);
      alert('✅ Car permanently deleted from the system!');
      setPermanentDeleteCarModal({ open: false, carId: null });
      fetchCars(carsPage, carSearch, carFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to permanently delete car');
    }
  };

  // Initial fetch based on tab
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(usersPage, userSearch, userFilter);
    } else if (activeTab === 'cars') {
      fetchCars(carsPage, carSearch, carFilter);
    } else if (activeTab === 'admins') {
      fetchAdmins(adminsPage, adminSearch, adminFilter);
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
    borderBottom: '2px solid #ff9800',
    flexWrap: 'wrap',
  };

  const tabButtonStyle = (active) => ({
    padding: '12px 20px',
    border: 'none',
    background: active ? '#ff9800' : 'transparent',
    color: active ? '#fff' : '#666',
    cursor: 'pointer',
    fontWeight: active ? 'bold' : 'normal',
    fontSize: '14px',
    borderRadius: '8px 8px 0 0',
    transition: 'all 0.3s',
    borderBottom: active ? '3px solid #f57c00' : 'none',
  });

  const cardStyle = {
    background: '#f5f5f5',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  };

  const buttonStyle = (danger = false, orange = false) => ({
    padding: '8px 15px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    background: danger ? '#e74c3c' : orange ? '#ff9800' : '#64b5f6',
    color: '#fff',
    marginRight: '8px',
    transition: 'all 0.3s',
  });

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContent = {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#ff9800', marginBottom: '20px' }}>👑 SuperAdmin Dashboard</h1>

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
          style={tabButtonStyle(activeTab === 'admins')}
          onClick={() => handleTabChange('admins')}
        >
          👨‍💼 Admins ({admins.length})
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
              }}
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : (
            <>
              {users.map((user) => (
                <div key={user._id} style={cardStyle}>
                  <h3>{user.name}</h3>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Status: {user.isSuspended ? '🔴 Suspended' : '🟢 Active'}</p>
                  {user.isSuspended && <p>Reason: {user.suspensionReason}</p>}
                  <div>
                    {user.isSuspended ? (
                      <>
                        <button
                          style={buttonStyle(false, true)}
                          onClick={() => handleUnsuspendUser(user._id)}
                        >
                          ✅ Unsuspend
                        </button>
                        <button
                          style={buttonStyle(true)}
                          onClick={() => setPermanentDeleteUserModal({ open: true, userId: user._id })}
                        >
                          🗑️ Delete Permanently
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          style={buttonStyle(true)}
                          onClick={() => setSuspendModal({ open: true, userId: user._id })}
                        >
                          ⛔ Suspend
                        </button>
                        <button
                          style={buttonStyle(true)}
                          onClick={() => setPermanentDeleteUserModal({ open: true, userId: user._id })}
                        >
                          🗑️ Delete Permanently
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
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
              }}
            >
              <option value="all">All Cars</option>
              <option value="active">Active</option>
              <option value="removed">Removed</option>
            </select>
          </div>

          {loading ? (
            <p>Loading cars...</p>
          ) : (
            <>
              {cars.map((car) => (
                <div key={car._id} style={cardStyle}>
                  <h3>{car.title}</h3>
                  <p>Brand: {car.brand}</p>
                  <p>Price: ₹{car.price}</p>
                  <p>Status: {car.isRemoved ? '🔴 Removed' : '🟢 Active'}</p>
                  {car.isRemoved && <p>Reason: {car.removalReason}</p>}
                  <div>
                    {car.isRemoved ? (
                      <>
                        <button
                          style={buttonStyle(false, true)}
                          onClick={() => handleRestoreCar(car._id)}
                        >
                          ✅ Restore
                        </button>
                        <button
                          style={buttonStyle(true)}
                          onClick={() => setPermanentDeleteCarModal({ open: true, carId: car._id })}
                        >
                          🗑️ Delete Permanently
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          style={buttonStyle(true)}
                          onClick={() => setRemoveModal({ open: true, carId: car._id })}
                        >
                          ⛔ Remove
                        </button>
                        <button
                          style={buttonStyle(true)}
                          onClick={() => setPermanentDeleteCarModal({ open: true, carId: car._id })}
                        >
                          🗑️ Delete Permanently
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Admins Tab */}
      {activeTab === 'admins' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button
              style={buttonStyle(false, true)}
              onClick={() => setCreateAdminModal({ open: true })}
            >
              ➕ Create New Admin
            </button>
            <input
              type="text"
              placeholder="Search admins..."
              value={adminSearch}
              onChange={(e) => {
                setAdminSearch(e.target.value);
                setAdminsPage(1);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') fetchAdmins(1, e.target.value, adminFilter);
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
              }}
            />
            <select
              value={adminFilter}
              onChange={(e) => {
                setAdminFilter(e.target.value);
                setAdminsPage(1);
              }}
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
              }}
            >
              <option value="all">All Admins</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {loading ? (
            <p>Loading admins...</p>
          ) : (
            <>
              {admins && admins.length > 0 ? (
                admins.map((admin) => (
                  <div key={admin._id} style={cardStyle}>
                    <h3>{admin.name}</h3>
                    <p>Email: {admin.email}</p>
                    <p>Role: {admin.role}</p>
                    <p>Status: {admin.isActive ? '🟢 Active' : '🔴 Inactive'}</p>
                    <p>Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
                    <div>
                      {admin.isActive ? (
                        <>
                          <button
                            style={buttonStyle(true)}
                            onClick={() => setDeleteAdminModal({ open: true, adminId: admin._id })}
                          >
                            ⛔ Disable
                          </button>
                          <button
                            style={buttonStyle(true)}
                            onClick={() => setPermanentDeleteAdminModal({ open: true, adminId: admin._id })}
                          >
                            🗑️ Delete Permanently
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            style={buttonStyle(false, true)}
                            onClick={() => handleRestoreAdmin(admin._id)}
                          >
                            ✅ Restore
                          </button>
                          <button
                            style={buttonStyle(true)}
                            onClick={() => setPermanentDeleteAdminModal({ open: true, adminId: admin._id })}
                          >
                            🗑️ Delete Permanently
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No admins found</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          {loading ? (
            <p>Loading analytics...</p>
          ) : analytics ? (
            <>
              <div style={cardStyle}>
                <h3>📊 Platform Statistics</h3>
                <p>Total Users: <strong>{analytics.totalUsers || 0}</strong></p>
                <p>Active Users: <strong>{analytics.activeUsers || 0}</strong></p>
                <p>Total Cars: <strong>{analytics.totalCars || 0}</strong></p>
                <p>Active Listings: <strong>{analytics.activeListings || 0}</strong></p>
                <p>Total Admins: <strong>{analytics.totalAdmins || 0}</strong></p>
              </div>
            </>
          ) : (
            <p>No analytics available</p>
          )}
        </div>
      )}

      {/* Create Admin Modal */}
      {createAdminModal.open && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h2>Create New Admin</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Admin Name
              </label>
              <input
                type="text"
                placeholder="Enter admin name"
                value={newAdminData.name}
                onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={newAdminData.email}
                onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={buttonStyle(false, true)}
                onClick={handleCreateAdmin}
              >
                ✅ Create
              </button>
              <button
                style={buttonStyle(true)}
                onClick={() => {
                  setCreateAdminModal({ open: false });
                  setNewAdminData({ name: '', email: '', password: '' });
                }}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Admin Modal */}
      {deleteAdminModal.open && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h2>Disable Admin?</h2>
            <p>Are you sure you want to disable this admin account? They can be restored later.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={buttonStyle(true)}
                onClick={handleDeleteAdmin}
              >
                ⛔ Disable
              </button>
              <button
                style={buttonStyle(false, true)}
                onClick={() => setDeleteAdminModal({ open: false, adminId: null })}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanently Delete Admin Modal */}
      {permanentDeleteAdminModal.open && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h2 style={{ color: '#e74c3c' }}>⚠️ PERMANENTLY DELETE ADMIN?</h2>
            <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>This action CANNOT be undone!</p>
            <p>This will permanently remove the admin account from the system. All data associated with this admin will be lost.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={buttonStyle(true)}
                onClick={handlePermanentlyDeleteAdmin}
              >
                🗑️ Delete Permanently
              </button>
              <button
                style={buttonStyle(false, true)}
                onClick={() => setPermanentDeleteAdminModal({ open: false, adminId: null })}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanently Delete User Modal */}
      {permanentDeleteUserModal.open && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h2 style={{ color: '#e74c3c' }}>⚠️ PERMANENTLY DELETE USER?</h2>
            <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>This action CANNOT be undone!</p>
            <p>This will permanently remove the user account from the system. All data associated with this user will be lost.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={buttonStyle(true)}
                onClick={handlePermanentlyDeleteUser}
              >
                🗑️ Delete Permanently
              </button>
              <button
                style={buttonStyle(false, true)}
                onClick={() => setPermanentDeleteUserModal({ open: false, userId: null })}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanently Delete Car Modal */}
      {permanentDeleteCarModal.open && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h2 style={{ color: '#e74c3c' }}>⚠️ PERMANENTLY DELETE CAR?</h2>
            <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>This action CANNOT be undone!</p>
            <p>This will permanently remove the car listing from the system. All data associated with this listing will be lost.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={buttonStyle(true)}
                onClick={handlePermanentlyDeleteCar}
              >
                🗑️ Delete Permanently
              </button>
              <button
                style={buttonStyle(false, true)}
                onClick={() => setPermanentDeleteCarModal({ open: false, carId: null })}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Modal */}
      {suspendModal.open && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h2>Suspend User</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Reason for suspension
              </label>
              <textarea
                placeholder="Enter reason..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={buttonStyle(true)}
                onClick={handleSuspendUser}
              >
                ⛔ Suspend
              </button>
              <button
                style={buttonStyle(false, true)}
                onClick={() => setSuspendModal({ open: false, userId: null })}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Car Modal */}
      {removeModal.open && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h2>Remove Car Listing</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Reason for removal
              </label>
              <textarea
                placeholder="Enter reason..."
                value={removeReason}
                onChange={(e) => setRemoveReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={buttonStyle(true)}
                onClick={handleRemoveCar}
              >
                ⛔ Remove
              </button>
              <button
                style={buttonStyle(false, true)}
                onClick={() => setRemoveModal({ open: false, carId: null })}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
