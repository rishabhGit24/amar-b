import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaButtonText: string;
  onCtaClick?: () => void; // Optional click handler for the CTA button
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Welcome to Our Platform',
  subtitle = 'Discover amazing features and unlock your potential.',
  imageUrl = 'https://via.placeholder.com/1920x1080.png?text=Hero+Background', // Default placeholder image
  ctaButtonText = 'Get Started',
  onCtaClick,
}) => {
  // Basic validation for imageUrl to ensure it's a string
  if (typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    console.error('HeroSection: imageUrl prop is invalid or missing.');
    // Optionally, render a fallback or a specific error message
    // For production, consider a more robust error handling strategy
  }

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '60vh', // Adjust as needed for visual prominence
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white', // Default text color, adjust based on image contrast
        textAlign: 'center',
        padding: '4rem 2rem', // Responsive padding
        position: 'relative',
      }}
      aria-label="Hero section with compelling title and subtitle"
    >
      {/* Overlay for better text readability if needed */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for contrast
          zIndex: 1,
        }}
      ></div>

      <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
        <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 700 }}>
          {title}
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.5rem', marginBottom: '2rem', lineHeight: '1.6' }}>
          {subtitle}
        </p>
        {ctaButtonText && (
          <button
            className="hero-cta-button"
            onClick={onCtaClick}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              backgroundColor: '#007bff', // Example primary color
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')} // Example hover effect
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
            aria-label={`Call to action: ${ctaButtonText}`}
          >
            {ctaButtonText}
          </button>
        )}
      </div>
    </section>
  );
};

export default HeroSection;