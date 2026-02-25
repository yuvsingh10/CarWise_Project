import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SellCar = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    ownerPhone: '',
    modelYear: '',
    kmsDriven: '',
    fuelType: '',
    transmission: '',
    seats: '',
    ownership: '',
    description: '',
    photo: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const phone = decoded.phone || '';

      setForm((prev) => ({
        ...prev,
        ownerPhone: phone,
      }));
    } catch (err) {
      console.error('Token decode failed:', err);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('Only JPEG and PNG images are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.onerror = () => alert('Failed to load image.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name, price, ownerPhone, modelYear,
      kmsDriven, fuelType, transmission, seats, ownership, photo
    } = form;

    if (
      !name || !price || !ownerPhone || !modelYear ||
      !kmsDriven || !fuelType || !transmission || !seats || !ownership
    ) {
      alert('Please fill all required fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first.');
      return;
    }

    // Prepare car data - convert string values to numbers
    const carData = {
      name,
      price: parseFloat(price),
      modelYear: parseInt(modelYear),
      kmsDriven: parseInt(kmsDriven),
      fuelType,
      transmission,
      seats: parseInt(seats),
      ownership: parseInt(ownership),
      photo: photo || '',
      description: form.description || '',
    };

    // Send to API
    fetch('http://localhost:5000/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(carData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message?.includes('✅')) {
          alert('Car listed for sale successfully!');
          navigate('/dashboard');
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('Failed to list car. Please try again.');
      });
  };

  return (
    <div
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/BG2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 700,
          padding: 35,
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 25, color: '#64b5f6', fontSize: '1.8rem', fontWeight: '900' }}>
          Sell Your Car
        </h2>
        <form onSubmit={handleSubmit}>
          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Car Name<span style={{ color: '#ef5350' }}>*</span></label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Toyota Corolla" style={inputStyle} />

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Price (₹)<span style={{ color: '#ef5350' }}>*</span></label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="350000" min="0" style={inputStyle} />

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Owner Phone<span style={{ color: '#ef5350' }}>*</span></label>
          <input type="tel" name="ownerPhone" value={form.ownerPhone} onChange={handleChange} required placeholder="9876543210" pattern="[0-9]{10}" title="Enter 10 digit phone number" style={inputStyle} disabled />

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Model Year<span style={{ color: '#ef5350' }}>*</span></label>
          <input type="number" name="modelYear" value={form.modelYear} onChange={handleChange} required placeholder="2015" min="1900" max={new Date().getFullYear()} style={inputStyle} />

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Kilometers Driven<span style={{ color: '#ef5350' }}>*</span></label>
          <input type="number" name="kmsDriven" value={form.kmsDriven} onChange={handleChange} required placeholder="50000" min="0" style={inputStyle} />

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Fuel Type<span style={{ color: '#ef5350' }}>*</span></label>
          <select name="fuelType" value={form.fuelType} onChange={handleChange} required style={inputStyle}>
            <option value="">-- Select Fuel Type --</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="CNG">CNG</option>
          </select>

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Transmission<span style={{ color: '#ef5350' }}>*</span></label>
          <select name="transmission" value={form.transmission} onChange={handleChange} required style={inputStyle}>
            <option value="">-- Select Transmission --</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Number of Seats<span style={{ color: '#ef5350' }}>*</span></label>
          <input type="number" name="seats" value={form.seats} onChange={handleChange} required placeholder="5" min="1" style={inputStyle} />

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Ownership (Number of owners)<span style={{ color: '#ef5350' }}>*</span></label>
          <input type="number" name="ownership" value={form.ownership} onChange={handleChange} required placeholder="1" min="1" max="3" style={inputStyle} />

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Description (Optional)</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Add details about the car..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />

          <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Upload Photo (jpg/jpeg/png)</label>
          <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handlePhotoChange} style={{ marginBottom: 15, color: '#fff' }} />

          {form.photo && (
            <div style={{ marginBottom: 15 }}>
              <img src={form.photo} alt="Preview" style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 6, border: '2px solid #64b5f6' }} />
            </div>
          )}

          <button type="submit" style={submitBtnStyle} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#42a5f5'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#64b5f6'; }}>List Car for Sale</button>

          <button type="button" onClick={() => navigate(-1)} style={{ ...submitBtnStyle, backgroundColor: '#6c757d', marginTop: 10 }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#5a626d'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#6c757d'; }}>
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  marginBottom: 15,
  borderRadius: 8,
  border: '2px solid rgba(100, 181, 246, 0.3)',
  fontSize: 15,
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  transition: 'all 0.3s',
};

const submitBtnStyle = {
  width: '100%',
  padding: 14,
  backgroundColor: '#64b5f6',
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(100, 181, 246, 0.4)',
};

export default SellCar;
