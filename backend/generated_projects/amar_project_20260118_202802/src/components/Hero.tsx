import React from 'react';


interface HeroProps {
  image?: string;
  headline?: string;
  subheadline?: string;
}

const Hero: React.FC<HeroProps> = ({ image = '', headline = '', subheadline = '' }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Large, visually appealing hero section for the homepage, setting the tone.</p>
    </div>
  );
};

export default Hero;
