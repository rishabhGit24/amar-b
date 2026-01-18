import React from 'react';


interface HeroProps {
  headline?: string;
  subheadline?: string;
  image?: string;
}

const Hero: React.FC<HeroProps> = ({ headline = '', subheadline = '', image = '' }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Large hero section with a welcoming message and appetizing image.</p>
    </div>
  );
};

export default Hero;
