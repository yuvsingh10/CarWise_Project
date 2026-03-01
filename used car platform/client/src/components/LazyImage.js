import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let observer;

    if (imageRef && imageRef) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              setIsLoading(false);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      observer.observe(imageRef);
    }

    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, src]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc || 'https://via.placeholder.com/400x150?text=Loading...'}
      alt={alt}
      loading="lazy"
      style={{
        opacity: isLoading ? 0.5 : 1,
        transition: 'opacity 0.3s ease-in-out',
        ...props.style,
      }}
      {...props}
    />
  );
};

export default LazyImage;
