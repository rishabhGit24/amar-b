import React from 'react';


interface HeroProps {
  heading?: string;
  subheading?: string;
  image?: string;
}

const Hero: React.FC<HeroProps> = ({ heading = '', subheading = '', image = '' }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Large, prominent section on the home page to capture attention, featuring a key message and image.</p>
    </div>
  );
};

export default Hero;
