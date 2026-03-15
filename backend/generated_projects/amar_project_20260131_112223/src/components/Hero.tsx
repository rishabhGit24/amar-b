import React from 'react';


interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

const Hero: React.FC<HeroProps> = ({ title = '', subtitle = '', imageUrl = '', ctaText = '', ctaLink = '' }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Large hero section with a prominent call to action, typical for an e-commerce landing page.</p>
    </div>
  );
};

export default Hero;
