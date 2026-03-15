import React from 'react';


interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

const Hero: React.FC<HeroProps> = ({ title = '', subtitle = '', ctaButtonText = '', ctaButtonLink = '' }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Prominent section at the top of the home page with a main message and call to action.</p>
    </div>
  );
};

export default Hero;
