import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RatingForm = ({ sellerId, carId, onRatingSubmitted, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canRate, setCanRate] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  useEffect(() => {
    checkRatingEligibility();
  }, [sellerId, carId]);

  const checkRatingEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const response = await api.get(`/ratings/can-rate/${sellerId}/${carId}`);
      setCanRate(response.data.canRate);
      if (!response.data.canRate) {
        setError(response.data.reason);
      }
    } catch (err) {
      setError('Unable to check rating eligibility');
      console.error('Error checking eligibility:', err);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canRate) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/ratings/create', {
        ratedUserId: sellerId,
        carId: carId,
        rating: parseInt(rating),
        comment: comment.trim(),
      });

      setRating(5);
      setComment('');
      if (onRatingSubmitted) {
        onRatingSubmitted(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit rating');
      console.error('Error submitting rating:', err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingEligibility) {
    return (
      <div style={styles.container}>
        <p>Checking eligibility...</p>
      </div>
    );
  }

  if (!canRate) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
        {onCancel && (
          <button onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Rate this Seller</h3>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={styles.ratingGroup}>
          <label style={styles.label}>Rating ⭐</label>
          <div style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  ...styles.star,
                  color: star <= rating ? '#ffc107' : '#ddd',
                }}
              >
                ★
              </button>
            ))}
          </div>
          <p style={styles.ratingText}>{rating} out of 5 stars</p>
        </div>

        {/* Comment */}
        <div style={styles.ratingGroup}>
          <label style={styles.label}>Comment (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this seller..."
            style={styles.textarea}
            maxLength="500"
            rows="4"
          />
          <p style={styles.charCount}>
            {comment.length}/500
          </p>
        </div>

        {/* Error Message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },

  title: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#000',
  },

  ratingGroup: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },

  starContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px',
  },

  star: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    padding: '0',
  },

  ratingText: {
    margin: '8px 0 0 0',
    fontSize: '13px',
    color: '#666',
  },

  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.3s',
    resize: 'vertical',
    boxSizing: 'border-box',
  },

  charCount: {
    margin: '6px 0 0 0',
    fontSize: '12px',
    color: '#999',
    textAlign: 'right',
  },

  error: {
    color: '#f02849',
    fontSize: '13px',
    marginBottom: '15px',
  },

  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },

  submitButton: {
    flex: 1,
    background: '#0084ff',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },

  cancelButton: {
    flex: 1,
    background: '#f0f0f0',
    color: '#333',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default RatingForm;
