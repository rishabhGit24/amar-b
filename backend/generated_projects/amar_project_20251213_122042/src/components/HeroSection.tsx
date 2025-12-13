import React from 'react';


interface HeroSectionProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

const HeroSection: React.FC<HeroSectionProps> = (props: HeroSectionProps) => {
  return (
    <div className="herosection">
      <h2>HeroSection</h2>
      <p>Prominent section at the top of the page with a background image and introductory text.</p>
    </div>
  );
};

export default HeroSection;
