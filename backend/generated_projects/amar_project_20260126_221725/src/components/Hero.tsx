import React from 'react';


interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  callToAction?: object;
}

const Hero: React.FC<HeroProps> = ({ title = '', subtitle = '', imageUrl = '', callToAction = {} }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Large hero section for the homepage with a main message and call to action.</p>
    </div>
  );
};

export default Hero;
