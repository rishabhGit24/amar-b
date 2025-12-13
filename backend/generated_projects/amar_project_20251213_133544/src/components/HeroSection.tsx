import React from 'react';


interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title = '', subtitle = '', backgroundImage = '' }) => {
  return (
    <div className="herosection">
      <h2>HeroSection</h2>
      <p>Large banner section for the home page with a prominent title and background image.</p>
    </div>
  );
};

export default HeroSection;
