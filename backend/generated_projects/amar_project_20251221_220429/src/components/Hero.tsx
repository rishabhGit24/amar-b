import React from 'react';


interface HeroProps {
  imageSrc?: string;
  headline?: string;
  subtext?: string;
}

const Hero: React.FC<HeroProps> = ({ imageSrc = '', headline = '', subtext = '' }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Large introductory section for the home page.</p>
    </div>
  );
};

export default Hero;
