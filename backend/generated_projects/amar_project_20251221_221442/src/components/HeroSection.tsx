import React from 'react';


interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title = '', subtitle = '', image = '' }) => {
  return (
    <div className="herosection">
      <h2>HeroSection</h2>
      <p>Large introductory section for the home page.</p>
    </div>
  );
};

export default HeroSection;
