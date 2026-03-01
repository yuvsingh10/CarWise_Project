import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EditCar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const car = location.state;

  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    ownerPhone: '',
    modelYear: '',
    kmsDriven: '',
    fuelType: '',
    transmission: '',
    seats: '',
    ownership: '',
    description: '',
    photo: null,
  });

  useEffect(() => {
    if (car) {
      setForm({
        name: car.name || '',
        brand: car.brand || '',
        price: car.price || '',
        ownerPhone: car.ownerPhone || '',
        modelYear: car.modelYear || '',
        kmsDriven: car.kmsDriven || '',
        fuelType: car.fuelType || '',
        transmission: car.transmission || '',
        seats: car.seats || '',
        ownership: car.ownership || '',
        description: car.description || '',
        photo: car.photo || null,
      });
    } else {
      navigate('/dashboard');
    }
  }, [car, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.price ||
      !form.ownerPhone ||
      !form.modelYear ||
      !form.kmsDriven ||
      !form.fuelType ||
      !form.transmission ||
      !form.seats ||
      !form.ownership
    ) {
      alert('Please fill all required fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first.');
      return;
    }

    // Prepare update data - convert string values to numbers
    const updateData = {
      name: form.name,
      price: parseFloat(form.price),
      modelYear: parseInt(form.modelYear),
      kmsDriven: parseInt(form.kmsDriven),
      fuelType: form.fuelType,
      transmission: form.transmission,
      seats: parseInt(form.seats),
      ownership: parseInt(form.ownership),
      photo: form.photo || '',
      description: form.description || '',
    };

    // Send to API
    fetch(`http://localhost:5000/api/cars/${car._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message?.includes('✅')) {
          alert('Car updated successfully!');
          navigate('/my-cars');
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('Failed to update car. Please try again.');
      });
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    marginBottom: 15,
    borderRadius: 8,
    border: '2px solid rgba(100, 181, 246, 0.3)',
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
    transition: 'all 0.3s ease',
    transform: 'translateY(0)',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/BG2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 700,
          width: '100%',
          padding: 35,
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#64b5f6', fontWeight: '900', fontSize: '1.8rem' }}>Edit Car Details</h2>
      <form onSubmit={handleSubmit}>
        
        <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Car Name<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Toyota Corolla"
          required
          style={inputStyle}
        />

        <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Brand<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Toyota"
          required
          style={inputStyle}
        />

        <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Price (₹)<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="350000"
          min="0"
          required
          style={inputStyle}
        />

        <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Owner Phone<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <input
          type="tel"
          name="ownerPhone"
          value={form.ownerPhone}
          onChange={handleChange}
          placeholder="9876543210"
          pattern="[0-9]{10}"
          title="Enter 10 digit phone number"
          required
          style={inputStyle}
        />

        
        <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Model Year<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <input
          type="number"
          name="modelYear"
          value={form.modelYear}
          onChange={handleChange}
          placeholder="2015"
          min="1900"
          max={new Date().getFullYear()}
          required
          style={inputStyle}
        />

        
        <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Kilometers Driven<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <input
          type="number"
          name="kmsDriven"
          value={form.kmsDriven}
          onChange={handleChange}
          placeholder="50000"
          min="0"
          required
          style={inputStyle}
        />

        
        <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Fuel Type<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <select
          name="fuelType"
          value={form.fuelType}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">-- Select Fuel Type --</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="CNG">CNG</option>
        </select>

        
        <label style={{ color: '#64b5f6', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Transmission<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <select
          name="transmission"
          value={form.transmission}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">-- Select Transmission --</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>

       
        <label style={{ color: '#64b5f6' }}>
          Number of Seats<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <input
          type="number"
          name="seats"
          value={form.seats}
          onChange={handleChange}
          placeholder="5"
          min="1"
          required
          style={inputStyle}
        />

        <label style={{ color: '#64b5f6' }}>
          Ownership (Number of owners)<span style={{ color: '#ef5350' }}>*</span>
        </label>
        <input
          type="number"
          name="ownership"
          value={form.ownership}
          onChange={handleChange}
          placeholder="1"
          min="1"
          required
          style={inputStyle}
        />

        <label style={{ color: '#64b5f6' }}>Description (Optional)</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add details about the car..."
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
        />

        
        <label style={{ color: '#64b5f6' }}>Upload Photo (jpg/jpeg/png)</label>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handlePhotoChange}
          style={{ marginBottom: 15 }}
        />

        
        {form.photo && (
          <img
            src={form.photo}
            alt="Preview"
            style={{ width: '100%', maxHeight: 250, objectFit: 'contain', marginBottom: 15, borderRadius: 8, border: '2px solid #64b5f6' }}
          />
        )}

        <button 
          type="submit" 
          style={submitBtnStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#42a5f5';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(100, 181, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#64b5f6';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(100, 181, 246, 0.4)';
          }}
        >
          Update Car Details
        </button>
      </form>
    </div>
    </div>
  );
};

export default EditCar;
