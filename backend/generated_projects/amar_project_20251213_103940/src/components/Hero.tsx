import React from 'react';


interface HeroProps {
  heading: string;
  subheading: string;
  imageUrl: string;
}

const Hero: React.FC<HeroProps> = (props: HeroProps) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Prominent introductory section with a main heading, a brief subheading, and an optional background image to set the tone.</p>
    </div>
  );
};

export default Hero;
