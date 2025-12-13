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
      <p>Prominent hero section for the landing page with a background image and call to action.</p>
    </div>
  );
};

export default HeroSection;
