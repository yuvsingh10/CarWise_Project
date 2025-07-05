import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [mobile, setMobile] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
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

      const photo = localStorage.getItem(`profilePhoto_${decoded.email}`);
      if (photo) setProfilePhoto(photo);

      const savedPhone = localStorage.getItem(`ownerPhone_${decoded.email}`);
      if (savedPhone) {
        setMobile(savedPhone);
      } else {
        const cars = JSON.parse(localStorage.getItem('cars')) || [];
        const myCar = cars.find((c) => c.registeredEmail === decoded.email);
        if (myCar?.ownerPhone) setMobile(myCar.ownerPhone);
      }
    } catch {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleMobileUpdate = () => {
    if (user?.email) {
      localStorage.setItem(`ownerPhone_${user.email}`, mobile);
      alert('Mobile number updated!');
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div style={outerStyle}>
      <div style={bgOverlay} />
      <div style={cardStyle}>
        <h2 style={{ color: '#007BFF', marginBottom: 20 }}>Your Profile</h2>

        {profilePhoto ? (
          <img src={profilePhoto} alt="Profile" style={imgStyle} />
        ) : (
          <div style={placeholderStyle}>No Photo</div>
        )}

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
          style={{ margin: '12px 0', fontSize: 14 }}
        />

        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email}</p>

        
        <label style={{ marginTop: 10, display: 'block', fontWeight: '600' }}>
          Mobile Number:
        </label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6 }}>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile No"
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 6,
              border: '1px solid #ccc',
            }}
          />
          <button
            onClick={handleMobileUpdate}
            style={{
              padding: '8px 16px',
              background: '#198754',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Update
          </button>
        </div>

        <div style={{ marginTop: 30 }}>
          <button onClick={() => navigate('/dashboard')} style={btnBlue}>
            ← Back to Dashboard
          </button>
          <button onClick={() => navigate('/delete')} style={btnRed}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};


const outerStyle = {
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Segoe UI, sans-serif',
  overflow: 'hidden',
};

const bgOverlay = {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'url("/BG3.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(10px)',
  zIndex: -1,
};

const cardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '40px 30px',
  borderRadius: 16,
  boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
  width: 360,
  textAlign: 'center',
  zIndex: 10,
};

const imgStyle = {
  width: 120,
  height: 120,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid #007BFF',
  marginBottom: 12,
  boxShadow: '0 0 10px rgba(0,123,255,0.4)',
};

const placeholderStyle = {
  ...imgStyle,
  background: '#dee2e6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#495057',
  fontWeight: 600,
};

const btnBlue = {
  padding: '10px 20px',
  marginRight: 10,
  background: '#0d6efd',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(13,110,253,0.4)',
};

const btnRed = {
  ...btnBlue,
  background: '#dc3545',
  boxShadow: '0 4px 12px rgba(220,53,69,0.4)',
};

export default Profile;
