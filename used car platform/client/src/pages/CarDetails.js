import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import RatingsDisplay from '../components/RatingsDisplay';
import RatingForm from '../components/RatingForm';

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state;

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  
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

  const handleSendMessage = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in to send messages');
      navigate('/');
      return;
    }

    if (user.id === car.ownerId._id) {
      alert('You cannot message yourself');
      return;
    }

    if (!messageText.trim()) {
      alert('Please enter a message');
      return;
    }

    setSendingMessage(true);
    try {
      await api.post('/messages/send', {
        recipientId: car.ownerId._id,
        carId: car._id,
        message: messageText,
      });
      alert('Message sent successfully!');
      setMessageModalOpen(false);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.response?.data?.error || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  
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
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/BG2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'none',
          zIndex: -1,
        }}
      />

      <div
        style={{
          maxWidth: 700,
          margin: '40px auto',
          padding: 35,
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h2 style={{ marginBottom: 25, color: '#64b5f6', fontWeight: '900', fontSize: '2.2rem' }}>{car.name}</h2>

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

        <div style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.8)' }}>
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

        {/* Seller Ratings Section */}
        <div style={{ marginTop: 30, padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
          <h3 style={{ 
            color: '#64b5f6', 
            marginTop: 0, 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '18px'
          }}>
            ⭐ Seller Reviews
          </h3>
          <RatingsDisplay userId={car.ownerId._id} />
          
          {/* Rating Form Toggle Button */}
          <button
            onClick={() => setShowRatingForm(!showRatingForm)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5568d3')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#667eea')}
          >
            {showRatingForm ? 'Cancel' : '✏️ Rate this Seller'}
          </button>

          {/* Rating Form */}
          {showRatingForm && (
            <div style={{ marginTop: '20px' }}>
              <RatingForm
                sellerId={car.ownerId._id}
                carId={car._id}
                onRatingSubmitted={() => {
                  setShowRatingForm(false);
                }}
                onCancel={() => setShowRatingForm(false)}
              />
            </div>
          )}
        </div>

        <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleBuyNow}
            style={{
              padding: '12px 28px',
              backgroundColor: '#64b5f6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: 16,
              boxShadow: '0 5px 15px rgba(100,181,246,0.5)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#42a5f5')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#64b5f6')}
          >
            Buy Now
          </button>

          <button
            onClick={() => setMessageModalOpen(true)}
            style={{
              padding: '12px 28px',
              backgroundColor: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: 16,
              boxShadow: '0 5px 15px rgba(102,126,234,0.5)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5568d3')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#667eea')}
          >
            📧 Message Seller
          </button>

          <button
            onClick={toggleLike}
            aria-label={liked ? "Unlike this car" : "Like this car"}
            style={{
              padding: '10px 18px',
              backgroundColor: liked ? '#f44336' : '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: 16,
              marginRight: 12,
              boxShadow: liked ? '0 5px 15px rgba(244,67,54,0.5)' : '0 5px 15px rgba(108,117,125,0.5)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = liked ? '#ef5350' : '#5a6268')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = liked ? '#f44336' : '#6c757d')}
          >
            {liked ? '♥ Liked' : '♡ Like'}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px 28px',
              backgroundColor: '#64b5f6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: 16,
              boxShadow: '0 5px 15px rgba(100,181,246,0.5)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#42a5f5')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#64b5f6')}
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

      {/* Message Modal */}
      {messageModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
          }}
          onClick={() => setMessageModalOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Message Seller</h2>
            <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
              Interested in {car.name}? Send a message to the seller.
            </p>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message here... (max 2000 characters)"
              maxLength="2000"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                minHeight: '120px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ marginTop: '15px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setMessageModalOpen(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: sendingMessage ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: sendingMessage ? 0.6 : 1,
                }}
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DetailRow = ({ label, value }) => (
  <p style={{ margin: '8px 0' }}>
    <strong style={{ color: '#64b5f6', minWidth: 120, display: 'inline-block' }}>{label}</strong>
    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{value}</span>
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
