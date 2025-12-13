import React from 'react';

/**
 * @typedef {object} HeroProps
 * @property {string} [title] - The main title for the hero section. Defaults to "Welcome to Our World!".
 * @property {string} [subtitle] - The subtitle or descriptive text for the hero section. Defaults to "Discover amazing experiences and connect with us.".
 * @property {string} [imageUrl] - The URL of the background image for the hero section. Defaults to a scenic placeholder image.
 */
interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

/**
 * Hero component for a prominent home page section.
 * Designed to be warm and inviting with a large image and welcoming text.
 * All props are optional and have sensible default values, allowing the component
 * to be used as `<Hero />` without any configuration.
 *
 * @param {HeroProps} props - The properties for the Hero component.
 * @returns {JSX.Element} The rendered Hero section.
 */
const Hero: React.FC<HeroProps> = ({
  title = 'Welcome to Our World!',
  subtitle = 'Discover amazing experiences and connect with us.',
  imageUrl = 'https://images.unsplash.com/photo-1501854140801-50d00698b723?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80' // A warm, inviting landscape placeholder
}) => {
  // Generate a descriptive alt text for the image, prioritizing the title if available.
  const imageAltText = title ? `${title} background image` : 'Hero section background image showing a beautiful landscape';

  return (
    <section className="hero-section" aria-label="Hero Section">
      <div className="hero-image-container">
        {/* The image is decorative and provides context for the text. */}
        <img src={imageUrl} alt={imageAltText} className="hero-image" role="presentation" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>
    </section>
  );
};

export default Hero;