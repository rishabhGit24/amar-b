import React from 'react';


interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const Hero: React.FC<HeroProps> = ({ title = '', subtitle = '', imageUrl = '' }) => {
  return (
    <div className="hero">
      <h2>Hero</h2>
      <p>Large, visually appealing banner section for the homepage, prominently displaying 'Bella Napoli Pizzeria' and a slogan like 'Authentic Italian Pizza Made with Love Since 1985', often with a background image of delicious pizza.</p>
    </div>
  );
};

export default Hero;
