import React from 'react';


interface HeroSectionProps {
  headline?: string;
  description?: string;
  ctaText?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ headline = '', description = '', ctaText = '' }) => {
  return (
    <div className="herosection">
      <h2>HeroSection</h2>
      <p>Main hero section with call-to-action button</p>
    </div>
  );
};

export default HeroSection;
