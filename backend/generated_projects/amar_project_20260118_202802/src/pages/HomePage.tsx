import React from 'react';
import Hero from '../components/Hero';
import FeaturedItems from '../components/FeaturedItems';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page showcasing the coffee shop's ambiance and key offerings.</p>
        <Hero />
        <FeaturedItems />
      </div>
    </div>
  );
};

export default HomePage;
