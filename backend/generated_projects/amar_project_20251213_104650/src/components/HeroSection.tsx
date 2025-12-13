import React from 'react';


interface HeroSectionProps {
  heading: string;
  subheading: string;
  imageUrl: string;
  callToActionText: string;
  callToActionLink: string;
}

const HeroSection: React.FC<HeroSectionProps> = (props: HeroSectionProps) => {
  return (
    <div className="herosection">
      <h2>HeroSection</h2>
      <p>Prominent hero section with a captivating image/video and a main message about AI.</p>
    </div>
  );
};

export default HeroSection;
