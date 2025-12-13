import React from 'react';

/**
 * @typedef {object} HeroProps
 * @property {string} [heading] - The main title for the hero section. Defaults to 'Welcome to Our World'.
 * @property {string} [subheading] - The subtitle or descriptive text for the hero section. Defaults to 'Explore, discover, and connect with us.'.
 * @property {string} [backgroundImage] - The URL for the background image of the hero section. Defaults to a placeholder image.
 */
interface HeroProps {
  heading?: string;
  subheading?: string;
  backgroundImage?: string;
}

/**
 * Hero component displays a prominent hero section with a main title, subtitle,
 * and a background image. All props are optional and have default values,
 * allowing the component to be used as `<Hero />` without any configuration.
 *
 * @param {HeroProps} props - The properties for the Hero component.
 * @returns {JSX.Element} A React functional component.
 */
const Hero: React.FC<HeroProps> = ({
  heading = 'Welcome to Our World',
  subheading = 'Explore, discover, and connect with us.',
  backgroundImage = 'https://via.placeholder.com/1920x1080/007bff/ffffff?text=Hero+Background', // Default placeholder image
}) => {
  // Define inline styles for the background image.
  // Using CSS background-image property is common for hero sections
  // as it allows for better control over positioning and responsiveness
  // compared to an <img> tag for purely decorative backgrounds.
  const heroStyle: React.CSSProperties = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    // Use a semantic <section> element for the hero banner.
    // Add role="banner" for accessibility to indicate it's a primary landmark.
    // aria-label provides a concise, accessible name for the banner.
    <section className="hero-section" style={heroStyle} role="banner" aria-label={heading}>
      {/* An optional overlay div for better text readability over varying background images.
          aria-hidden="true" ensures screen readers ignore this purely presentational element. */}
      <div className="hero-overlay" aria-hidden="true"></div>
      
      {/* Container for the text content */}
      <div className="hero-content">
        {/* Main heading of the hero section */}
        <h1 className="hero-heading">{heading}</h1>
        
        {/* Subheading or descriptive text */}
        <p className="hero-subheading">{subheading}</p>
      </div>
    </section>
  );
};

export default Hero;