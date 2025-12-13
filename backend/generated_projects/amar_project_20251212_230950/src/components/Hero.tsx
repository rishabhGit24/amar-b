import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = 'Welcome to Our Awesome Service',
  subtitle = 'Discover the best solutions for your needs.',
  imageUrl = 'https://via.placeholder.com/1500x500?text=Hero+Image',
}) => {
  return (
    <section
      className="hero-section"
      aria-label="Hero section with introductory information"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '100px 20px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div
        className="hero-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      ></div>
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {title}
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          {subtitle}
        </p>
        {/* You can add a call to action button here if needed */}
        {/* <button className="hero-cta" style={{ padding: '10px 20px', fontSize: '1.2rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Learn More
        </button> */}
      </div>
    </section>
  );
};

export default Hero;