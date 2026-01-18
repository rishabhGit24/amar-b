import React from 'react';


interface HeroSectionProps {
  headline?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ headline = '', description = '', ctaText = '', ctaLink = '' }) => {
  return (
    <div className="herosection">
      <h2>HeroSection</h2>
      <p>Main hero section with headline, description, and call-to-action</p>
    </div>
  );
};

export default HeroSection;
