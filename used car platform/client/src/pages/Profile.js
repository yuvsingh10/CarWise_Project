import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import RatingsDisplay from '../components/RatingsDisplay';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [mobile, setMobile] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);

      // Fetch profile from database to get phone number
      const fetchProfile = async () => {
        try {
          const response = await API.get('/auth/profile');
          if (response.data.phone) {
            setMobile(response.data.phone);
          }
        } catch (err) {
          console.error('❌ Failed to fetch profile:', err.message);
        }
      };
      
      fetchProfile();

      const photo = localStorage.getItem(`profilePhoto_${decoded.email}`);
      if (photo) setProfilePhoto(photo);
    } catch (err) {
      console.error('❌ Token decode error:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleMobileUpdate = async () => {
    if (user?.email) {
      try {
        const response = await API.put('/auth/profile', { phone: mobile });
        alert('Mobile number updated!');
        
        // Update the user state with new phone
        setUser((prev) => ({ ...prev, phone: mobile }));
        
        // Update stored phone in localStorage as well for persistence
        localStorage.setItem(`phone_${user.email}`, mobile);
      } catch (err) {
        alert('Failed to update phone: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (!user) return <p style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Loading profile...</p>;

  return (
    <div style={outerStyle}>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
      `}</style>
      
      <div style={cardStyle}>
        <h2 style={{ color: '#64b5f6', marginBottom: 20, fontSize: '1.8rem', fontWeight: '900' }}>👤 Your Profile</h2>

        {profilePhoto ? (
          <div>
            <img src={profilePhoto} alt="Profile" style={imgStyle} />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '8px 16px',
                  background: '#64b5f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#42a5f5';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#64b5f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ✏️ Edit Photo
              </button>
              <button
                onClick={() => {
                  setProfilePhoto(null);
                  localStorage.removeItem(`profilePhoto_${user.email}`);
                }}
                style={{
                  padding: '8px 16px',
                  background: '#ef5350',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f44336';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ef5350';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🗑️ Remove Photo
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={placeholderStyle}>📷 No Photo</div>
            <input
              type="file"
              accept="image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!file.type.match('image/jpeg')) {
                  return alert('Upload a .jpg image');
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                  const b64 = reader.result;
                  setProfilePhoto(b64);
                  localStorage.setItem(`profilePhoto_${user.email}`, b64);
                };
                reader.readAsDataURL(file);
              }}
              style={{ 
                margin: '12px 0', 
                fontSize: 14,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer',
              }}
            />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.match('image/jpeg')) {
              return alert('Upload a .jpg image');
            }
            const reader = new FileReader();
            reader.onloadend = () => {
              const b64 = reader.result;
              setProfilePhoto(b64);
              localStorage.setItem(`profilePhoto_${user.email}`, b64);
            };
            reader.readAsDataURL(file);
          }}
          style={{ display: 'none' }}
        />

        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '10px 0', fontSize: '15px' }}>
            <strong style={{ color: '#64b5f6' }}>👤 Name:</strong> {user.name || 'N/A'}
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '10px 0', fontSize: '15px' }}>
            <strong style={{ color: '#64b5f6' }}>📧 Email:</strong> {user.email}
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '10px 0', fontSize: '15px' }}>
            <strong style={{ color: '#64b5f6' }}>📱 Mobile Number:</strong> {mobile && mobile.trim() ? mobile : 'Not added'}
          </p>
        </div>

        <div style={{ marginTop: 30, display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={btnBlue}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#42a5f5';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(100, 181, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#64b5f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(100, 181, 246, 0.4)';
            }}
          >
            ← Back to Dashboard
          </button>
          <button 
            onClick={() => navigate('/delete')} 
            style={btnRed}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef5350';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f44336';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(244, 67, 54, 0.4)';
            }}
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>

      {/* Seller Ratings Section */}
      {user && (
        <div style={{
          maxWidth: '900px',
          margin: '40px auto 0',
          padding: '0 20px',
          width: '100%',
        }}>
          <RatingsDisplay userId={user.id} />
        </div>
      )}
    </div>
  );
};


const outerStyle = {
  position: 'relative',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  background: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/BG3.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  overflow: 'hidden',
};

const cardStyle = {
  background: 'rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(20px)',
  padding: '35px 30px',
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
  width: '100%',
  maxWidth: '420px',
  textAlign: 'center',
  zIndex: 10,
  border: '1px solid rgba(255, 255, 255, 0.15)',
};

const imgStyle = {
  width: 120,
  height: 120,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid #64b5f6',
  marginBottom: 12,
  boxShadow: '0 0 15px rgba(100, 181, 246, 0.6)',
};

const placeholderStyle = {
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: 'rgba(100, 181, 246, 0.15)',
  border: '3px solid #64b5f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#64b5f6',
  fontWeight: 600,
  margin: '0 auto 12px auto',
  boxShadow: '0 0 15px rgba(100, 181, 246, 0.4)',
};

const btnBlue = {
  padding: '11px 24px',
  background: '#64b5f6',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: '700',
  boxShadow: '0 4px 15px rgba(100, 181, 246, 0.4)',
  transition: 'all 0.3s ease',
};

const btnGreen = {
  padding: '10px 16px',
  background: '#66bb6a',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
};

const btnRed = {
  padding: '11px 24px',
  background: '#f44336',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: '700',
  boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)',
  transition: 'all 0.3s ease',
};

export default Profile;
