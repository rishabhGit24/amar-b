import React from 'react';


interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title = '', subtitle = '', ctaText = '', ctaLink = '', backgroundImage = '' }) => {
  return (
    <div className="herosection">
      <h2>HeroSection</h2>
      <p>A prominent section on the homepage to welcome visitors and highlight the shop's main offering.</p>
    </div>
  );
};

export default HeroSection;
