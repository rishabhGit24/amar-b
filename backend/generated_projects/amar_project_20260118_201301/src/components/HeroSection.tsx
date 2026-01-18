import React from 'react';


interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title = '', subtitle = '', backgroundImage = '', children }) => {
  return (
    <div className="herosection">
      {children || (
        <>
      <h2>HeroSection</h2>
      <p>Large, visually appealing section for the homepage, setting the elegant and fancy tone.</p>
        </>
      )}
    </div>
  );
};

export default HeroSection;
