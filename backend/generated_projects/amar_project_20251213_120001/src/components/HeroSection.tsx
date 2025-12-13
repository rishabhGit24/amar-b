import React from 'react';

/**
 * @interface HeroSectionProps
 * Defines the props for the HeroSection component.
 * All props are optional and have default values.
 */
interface HeroSectionProps {
  /**
   * The main title displayed in the hero section.
   * @default "Welcome to Our Platform"
   */
  title?: string;
  /**
   * A brief descriptive subtitle for the hero section.
   * @default "Discover innovative solutions and connect with our community."
   */
  subtitle?: string;
  /**
   * The URL for the background image of the hero section.
   * @default "https://via.placeholder.com/1920x1080/007bff/ffffff?text=Hero+Background+Image"
   */
  imageUrl?: string;
}

/**
 * HeroSection Component
 * A prominent section at the top of the Home page with a large background image,
 * a welcoming title, and a brief description.
 *
 * All props are optional and provide sensible default values, allowing the component
 * to be used simply as `<HeroSection />`.
 *
 * @param {HeroSectionProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered HeroSection component.
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Welcome to Our Platform',
  subtitle = 'Discover innovative solutions and connect with our community.',
  imageUrl = 'https://via.placeholder.com/1920x1080/007bff/ffffff?text=Hero+Background+Image', // Default placeholder image
}) => {
  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#ffffff', // Default text color for contrast
        textAlign: 'center',
        padding: '100px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh', // Ensure a minimum height for prominence
        position: 'relative',
        overflow: 'hidden', // Prevent image overflow
      }}
      aria-labelledby="hero-title" // Connects the section to its main title for accessibility
    >
      {/* Overlay for better text readability on diverse background images */}
      <div
        className="hero-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
          zIndex: 1, // Ensure overlay is below content but above background
        }}
      ></div>

      {/* Content container to ensure text is above the overlay */}
      <div
        className="hero-content"
        style={{
          position: 'relative', // Position content above the overlay
          zIndex: 2, // Ensure content is above the overlay
          maxWidth: '900px', // Limit content width for readability
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <h1
          id="hero-title" // Unique ID for aria-labelledby
          className="hero-title"
          style={{
            fontSize: '3.5rem', // Large font size for title
            fontWeight: 700,
            marginBottom: '20px',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <p
          className="hero-subtitle"
          style={{
            fontSize: '1.5rem', // Subtitle font size
            lineHeight: 1.6,
            maxWidth: '700px', // Limit subtitle width
            margin: '0 auto',
          }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;