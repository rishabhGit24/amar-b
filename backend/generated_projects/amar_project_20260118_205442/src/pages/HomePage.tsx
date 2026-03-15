import React from 'react';
import Hero from '../components/Hero';
import MenuHighlights from '../components/MenuHighlights';
import LocationHours from '../components/LocationHours';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page featuring a hero section, highlights from the menu, and essential location and hours information.</p>
        <Hero />
        <MenuHighlights />
        <LocationHours />
      </div>
    </div>
  );
};

export default HomePage;
