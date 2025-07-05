import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state;

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  
  const [liked, setLiked] = useState(false);

  
  const getUserEmail = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'guest';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || 'guest';
    } catch {
      return 'guest';
    }
  };

  const userEmail = getUserEmail();

  
  useEffect(() => {
    if (!car || !car.id) return;
    const favoritesRaw = localStorage.getItem('favorites');
    if (!favoritesRaw) return;

    try {
      const favorites = JSON.parse(favoritesRaw);
      if (favorites[userEmail] && favorites[userEmail].includes(car.id)) {
        setLiked(true);
      }
    } catch {}
  }, [car, userEmail]);

  
  const toggleLike = () => {
    if (!car || !car.id) return;
    const favoritesRaw = localStorage.getItem('favorites');
    let favorites = {};
    if (favoritesRaw) {
      try {
        favorites = JSON.parse(favoritesRaw);
      } catch {}
    }
    if (!favorites[userEmail]) favorites[userEmail] = [];

    if (liked) {
      
      favorites[userEmail] = favorites[userEmail].filter(id => id !== car.id);
      setLiked(false);
    } else {
      
      favorites[userEmail].push(car.id);
      setLiked(true);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  if (!car) {
    return (
      <div style={{ padding: 20, textAlign: 'center', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
        <p>No car details found.</p>
        <button onClick={() => navigate('/dashboard')} style={buttonStyle}>
          Go Back
        </button>
      </div>
    );
  }

  const photos = car.photos && car.photos.length > 0 ? car.photos : (car.photo ? [car.photo] : []);

  const openGallery = (index = 0) => {
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);

  const prevPhoto = () => setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const nextPhoto = () => setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  
  const handleBuyNow = () => {
    alert(`To buy this car, please contact the seller at ${car.ownerPhone}.`);
  };

  return (
    <>
      
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url("/BG3.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
          zIndex: -1,
        }}
      />

      <div
        style={{
          maxWidth: 700,
          margin: '40px auto',
          padding: 30,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 16,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h2 style={{ marginBottom: 25, color: '#0d6efd', fontWeight: '700', fontSize: '2.2rem' }}>{car.name}</h2>

        <div style={{ position: 'relative', marginBottom: 10, cursor: photos.length > 0 ? 'pointer' : 'default' }} onClick={() => photos.length > 0 && openGallery(0)}>
          <img
            src={photos[0] || 'https://via.placeholder.com/600x300?text=No+Image'}
            alt={car.name}
            style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 12, boxShadow: '0 8px 20px rgba(13,110,253,0.3)' }}
          />
          {photos.length > 0 && (
            <span
              style={{
                position: 'absolute',
                right: 12,
                bottom: 8,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                userSelect: 'none',
                boxShadow: '0 0 5px rgba(0,0,0,0.5)',
              }}
            >
              Tap for images of car
            </span>
          )}
        </div>

        <div style={{ fontSize: 16, lineHeight: 1.6, color: '#333' }}>
          <DetailRow label="Price:" value={car.price} />
          <DetailRow label="Owner Name:" value={car.ownerName} />
          <DetailRow label="Phone Number:" value={car.ownerPhone} />
          <DetailRow label="Model Year:" value={car.modelYear} />
          <DetailRow label="Fuel Type:" value={car.fuelType} />
          <DetailRow label="Transmission:" value={car.transmission} />
          <DetailRow label="Kms Driven:" value={car.kmsDriven} />
          <DetailRow label="Ownership:" value={car.ownership} />
          <DetailRow label="Seats:" value={car.seats} />
        </div>

        <div style={{ marginTop: 30, display: 'flex', alignItems: 'center' }}>
          <button
            onClick={handleBuyNow}
            style={{
              padding: '12px 28px',
              backgroundColor: '#198754',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: 16,
              marginRight: 12,
              boxShadow: '0 5px 15px rgba(25,135,84,0.5)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#145c32')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#198754')}
          >
            Buy Now
          </button>

          <button
            onClick={toggleLike}
            aria-label={liked ? "Unlike this car" : "Like this car"}
            style={{
              padding: '10px 18px',
              backgroundColor: liked ? '#dc3545' : '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: 16,
              marginRight: 12,
              boxShadow: liked ? '0 5px 15px rgba(220,53,69,0.5)' : '0 5px 15px rgba(108,117,125,0.5)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = liked ? '#a71d2a' : '#5a6268')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = liked ? '#dc3545' : '#6c757d')}
          >
            {liked ? '♥ Liked' : '♡ Like'}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px 28px',
              backgroundColor: '#0d6efd',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: 16,
              boxShadow: '0 5px 15px rgba(13,110,253,0.5)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#084298')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0d6efd')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      
      {galleryOpen && (
        <div
          onClick={closeGallery}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            cursor: 'pointer',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
            }}
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 38,
              color: '#fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              userSelect: 'none',
              filter: 'drop-shadow(0 0 2px black)',
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <img
            src={photos[currentIndex]}
            alt={`Car photo ${currentIndex + 1}`}
            style={{
              maxHeight: '90vh',
              maxWidth: '90vw',
              borderRadius: 12,
              boxShadow: '0 0 30px rgba(255,255,255,0.7)',
              cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
            }}
            style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 38,
              color: '#fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              userSelect: 'none',
              filter: 'drop-shadow(0 0 2px black)',
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
};

const DetailRow = ({ label, value }) => (
  <p style={{ margin: '8px 0' }}>
    <strong style={{ color: '#0d6efd', minWidth: 120, display: 'inline-block' }}>{label}</strong>
    <span style={{ color: '#333' }}>{value}</span>
  </p>
);

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0d6efd',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: 14,
};

export default CarDetails;
