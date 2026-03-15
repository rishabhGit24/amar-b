import React from 'react';


interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({ headline = '', subheadline = '', ctaText = '', backgroundImage = '' }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Prominent section to grab user attention with cafe's main offering.</p>
    </div>
  );
};

export default Hero;
