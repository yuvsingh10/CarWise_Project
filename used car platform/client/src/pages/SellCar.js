import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SellCar = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    ownerName: '',
    ownerPhone: '',
    registeredEmail: '',
    modelYear: '',
    kmsDriven: '',
    fuelType: '',
    transmission: '',
    seats: '',
    engine: '',
    ownership: '',
    photos: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const email = decoded.email;
      const phone = localStorage.getItem(`ownerPhone_${email}`);

      setForm((prev) => ({
        ...prev,
        registeredEmail: email,
        ownerPhone: phone || '',
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
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    );

    if (validFiles.length + form.photos.length > 10) {
      alert('You can upload a maximum of 10 images.');
      return;
    }

    const readers = validFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers)
      .then((newPhotos) =>
        setForm((prev) => ({ ...prev, photos: [...prev.photos, ...newPhotos] }))
      )
      .catch(() => alert('Failed to load one or more images.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name, price, ownerName, ownerPhone, registeredEmail, modelYear,
      kmsDriven, fuelType, transmission, seats, engine, ownership
    } = form;

    if (
      !name || !price || !ownerName || !ownerPhone || !registeredEmail || !modelYear ||
      !kmsDriven || !fuelType || !transmission || !seats || !engine || !ownership
    ) {
      alert('Please fill all required fields.');
      return;
    }

    const storedCars = JSON.parse(localStorage.getItem('cars')) || [];

    const newCar = {
      id: Date.now().toString(),
      ...form,
    };

    localStorage.setItem('cars', JSON.stringify([...storedCars, newCar]));
    alert('Car listed for sale successfully!');
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/BG2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 700,
          padding: 30,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 16,
          boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 25, color: '#007BFF' }}>
          Sell Your Car
        </h2>
        <form onSubmit={handleSubmit}>
          <label>Car Name<span style={{ color: 'red' }}>*</span></label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Toyota Corolla" style={inputStyle} />

          <label>Price (₹)<span style={{ color: 'red' }}>*</span></label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="350000" min="0" style={inputStyle} />

          <label>Owner Name<span style={{ color: 'red' }}>*</span></label>
          <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} required placeholder="John Doe" style={inputStyle} />

          <label>Owner Phone<span style={{ color: 'red' }}>*</span></label>
          <input type="tel" name="ownerPhone" value={form.ownerPhone} onChange={handleChange} required placeholder="9876543210" pattern="[0-9]{10}" title="Enter 10 digit phone number" style={inputStyle} />

          <label>Registered Email<span style={{ color: 'red' }}>*</span></label>
          <input type="email" name="registeredEmail" value={form.registeredEmail} onChange={handleChange} required placeholder="example@example.com" style={inputStyle} />

          <label>Model Year<span style={{ color: 'red' }}>*</span></label>
          <input type="number" name="modelYear" value={form.modelYear} onChange={handleChange} required placeholder="2015" min="1900" max={new Date().getFullYear()} style={inputStyle} />

          <label>Kilometers Driven<span style={{ color: 'red' }}>*</span></label>
          <input type="number" name="kmsDriven" value={form.kmsDriven} onChange={handleChange} required placeholder="50000" min="0" style={inputStyle} />

          <label>Fuel Type<span style={{ color: 'red' }}>*</span></label>
          <select name="fuelType" value={form.fuelType} onChange={handleChange} required style={inputStyle}>
            <option value="">-- Select Fuel Type --</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="CNG">CNG</option>
          </select>

          <label>Transmission<span style={{ color: 'red' }}>*</span></label>
          <select name="transmission" value={form.transmission} onChange={handleChange} required style={inputStyle}>
            <option value="">-- Select Transmission --</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <label>Number of Seats<span style={{ color: 'red' }}>*</span></label>
          <input type="number" name="seats" value={form.seats} onChange={handleChange} required placeholder="5" min="1" style={inputStyle} />

          <label>Engine Capacity<span style={{ color: 'red' }}>*</span></label>
          <input type="text" name="engine" value={form.engine} onChange={handleChange} required placeholder="1498 cc" style={inputStyle} />

          <label>Ownership (Number of owners)<span style={{ color: 'red' }}>*</span></label>
          <input type="number" name="ownership" value={form.ownership} onChange={handleChange} required placeholder="1" min="1" style={inputStyle} />

          <label>Upload Photos (jpg/jpeg/png, max 10)</label>
          <input type="file" accept="image/jpeg,image/jpg,image/png" multiple onChange={handlePhotoChange} style={{ marginBottom: 15 }} />

          {form.photos.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 15 }}>
              {form.photos.map((src, index) => (
                <img key={index} src={src} alt={`Preview ${index + 1}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid #ccc' }} />
              ))}
            </div>
          )}

          <button type="submit" style={submitBtnStyle}>List Car for Sale</button>

          <button type="button" onClick={() => navigate(-1)} style={{ ...submitBtnStyle, backgroundColor: '#6c757d', marginTop: 10 }}>
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: 10,
  marginBottom: 15,
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 15,
};

const submitBtnStyle = {
  width: '100%',
  padding: 14,
  backgroundColor: '#007BFF',
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,123,255,0.3)',
};

export default SellCar;
