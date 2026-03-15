import React from 'react';


interface HeroSectionProps {
  title?: string;
  tagline?: string;
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title = '', tagline = '', backgroundImage = '' }) => {
  return (
    <div className="herosection">
      <h2>HeroSection</h2>
      <p>The prominent first section of the landing page, featuring a captivating background image of the cafe or its products, a welcoming title, and a catchy tagline to immediately engage visitors.</p>
    </div>
  );
};

export default HeroSection;
