import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RatingsDisplay = ({ userId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserRatings();
  }, [userId]);

  const fetchUserRatings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ratings/user/${userId}`);
      const { ratings: ratingsData, averageRating: avg, totalReviews: total } = response.data.data;
      
      setRatings(ratingsData);
      setAverageRating(avg);
      setTotalReviews(total);
      setError('');
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError('Unable to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= rating ? '#ffc107' : '#ddd',
              fontSize: '14px',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Average Rating Summary */}
      <div style={styles.summary}>
        <div style={styles.summaryContent}>
          <div style={styles.averageRatingBig}>
            <p style={styles.averageRatingNumber}>{averageRating}</p>
            <StarRating rating={Math.round(parseFloat(averageRating))} />
            <p style={styles.reviewCount}>{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
          </div>

          {/* Rating Distribution */}
          <div style={styles.distribution}>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratings.filter((r) => r.rating === stars).length;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} style={styles.distributionRow}>
                  <span style={styles.distLabel}>{stars} ★</span>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                  <span style={styles.distCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      {totalReviews > 0 ? (
        <div style={styles.reviewsList}>
          <h3 style={styles.reviewsTitle}>All Reviews</h3>
          {ratings.map((review) => (
            <div key={review._id} style={styles.reviewItem}>
              {/* Reviewer Info */}
              <div style={styles.reviewerInfo}>
                <div style={styles.reviewerAvatar}>
                  {review.ratedBy?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || '?'}
                </div>
                <div style={styles.reviewerDetails}>
                  <p style={styles.reviewerName}>{review.ratedBy?.name}</p>
                  <p style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}{' '}
                    <span style={styles.carName}>• {review.car?.name}</span>
                  </p>
                </div>
              </div>

              {/* Rating */}
              <StarRating rating={review.rating} />

              {/* Comment */}
              {review.comment && (
                <p style={styles.reviewComment}>{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noReviews}>
          <p style={styles.noReviewsText}>No reviews yet</p>
          <p style={styles.noReviewsSubtext}>
            This seller doesn't have any reviews. Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '20px',
  },

  summary: {
    borderBottom: '1px solid #e5e5e5',
    paddingBottom: '24px',
    marginBottom: '24px',
  },

  summaryContent: {
    display: 'flex',
    gap: '48px',
  },

  averageRatingBig: {
    textAlign: 'center',
    minWidth: '120px',
  },

  averageRatingNumber: {
    margin: '0',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#000',
  },

  stars: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2px',
    margin: '8px 0',
  },

  reviewCount: {
    margin: '8px 0 0 0',
    fontSize: '13px',
    color: '#666',
  },

  distribution: {
    flex: 1,
  },

  distributionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '13px',
  },

  distLabel: {
    width: '30px',
    fontWeight: '500',
    color: '#666',
  },

  progressBar: {
    flex: 1,
    height: '6px',
    background: '#f0f0f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    background: '#ffc107',
    transition: 'width 0.3s',
  },

  distCount: {
    width: '30px',
    textAlign: 'right',
    color: '#999',
  },

  reviewsList: {
    marginTop: '24px',
  },

  reviewsTitle: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#000',
  },

  reviewItem: {
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '16px',
    marginBottom: '16px',
  },

  reviewerInfo: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    alignItems: 'flex-start',
  },

  reviewerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0,
  },

  reviewerDetails: {
    flex: 1,
  },

  reviewerName: {
    margin: '0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#000',
  },

  reviewDate: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#999',
  },

  carName: {
    color: '#666',
  },

  reviewComment: {
    margin: '12px 0 0 52px',
    fontSize: '13px',
    color: '#333',
    lineHeight: '1.5',
  },

  noReviews: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#999',
  },

  noReviewsText: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '500',
  },

  noReviewsSubtext: {
    margin: '0',
    fontSize: '13px',
    color: '#bbb',
  },
};

export default RatingsDisplay;
