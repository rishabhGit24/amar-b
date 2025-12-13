import React from 'react';


interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const Hero: React.FC<HeroProps> = ({ title = '', subtitle = '', imageUrl = '' }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Promotional hero section with a background image.</p>
    </div>
  );
};

export default Hero;
