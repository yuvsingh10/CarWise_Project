import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EditCar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const car = location.state;

  const [form, setForm] = useState({
    name: '',
    ownerName: '',
    price: '',
    ownerPhone: '',
    registeredEmail: '',
    modelYear: '',
    kmsDriven: '',
    fuelType: '',
    transmission: '',
    seats: '',
    engine: '',
    ownership: '',
    photo: null,
  });

  useEffect(() => {
    if (car) {
      setForm({
        name: car.name || '',
        ownerName: car.ownerName || '',
        price: car.price || '',
        ownerPhone: car.ownerPhone || '',
        registeredEmail: car.registeredEmail || '',
        modelYear: car.modelYear || '',
        kmsDriven: car.kmsDriven || '',
        fuelType: car.fuelType || '',
        transmission: car.transmission || '',
        seats: car.seats || '',
        engine: car.engine || '',
        ownership: car.ownership || '',
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
      !form.ownerName ||
      !form.price ||
      !form.ownerPhone ||
      !form.registeredEmail ||
      !form.modelYear ||
      !form.kmsDriven ||
      !form.fuelType ||
      !form.transmission ||
      !form.seats ||
      !form.engine ||
      !form.ownership
    ) {
      alert('Please fill all required fields.');
      return;
    }

    const storedCars = JSON.parse(localStorage.getItem('cars')) || [];

    const updatedCars = storedCars.map((c) =>
      c.id === car.id
        ? {
            ...c,
            name: form.name,
            ownerName: form.ownerName,
            price: form.price,
            ownerPhone: form.ownerPhone,
            registeredEmail: form.registeredEmail,
            modelYear: form.modelYear,
            kmsDriven: form.kmsDriven,
            fuelType: form.fuelType,
            transmission: form.transmission,
            seats: form.seats,
            engine: form.engine,
            ownership: form.ownership,
            photo: form.photo,
          }
        : c
    );

    localStorage.setItem('cars', JSON.stringify(updatedCars));

    alert('Car details updated successfully!');
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '40px auto',
        padding: 20,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Edit Car Details</h2>
      <form onSubmit={handleSubmit}>
        
        <label>
          Car Name<span style={{ color: 'red' }}>*</span>
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

        
        <label>
          Owner Name<span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          name="ownerName"
          value={form.ownerName}
          onChange={handleChange}
          placeholder="John Doe"
          required
          style={inputStyle}
        />

        
        <label>
          Price (₹)<span style={{ color: 'red' }}>*</span>
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

        
        <label>
          Owner Phone<span style={{ color: 'red' }}>*</span>
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

        
        <label>
          Registered Email<span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="email"
          name="registeredEmail"
          value={form.registeredEmail}
          onChange={handleChange}
          placeholder="example@example.com"
          required
          style={inputStyle}
        />

        
        <label>
          Model Year<span style={{ color: 'red' }}>*</span>
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

        
        <label>
          Kilometers Driven<span style={{ color: 'red' }}>*</span>
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

        
        <label>
          Fuel Type<span style={{ color: 'red' }}>*</span>
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

        
        <label>
          Transmission<span style={{ color: 'red' }}>*</span>
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

       
        <label>
          Number of Seats<span style={{ color: 'red' }}>*</span>
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

        
        <label>
          Engine Capacity<span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          name="engine"
          value={form.engine}
          onChange={handleChange}
          placeholder="1498 cc"
          required
          style={inputStyle}
        />

        
        <label>
          Ownership (Number of owners)<span style={{ color: 'red' }}>*</span>
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

        
        <label>Upload Photo (jpg/jpeg/png)</label>
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
            style={{ width: '100%', maxHeight: 250, objectFit: 'contain', marginBottom: 15, borderRadius: 8, border: '1px solid #ccc' }}
          />
        )}

        <button type="submit" style={submitBtnStyle}>
          Update Car Details
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: 10,
  marginBottom: 15,
  borderRadius: 4,
  border: '1px solid #ccc',
};

const submitBtnStyle = {
  width: '100%',
  padding: 14,
  backgroundColor: '#007BFF',
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
};

export default EditCar;
