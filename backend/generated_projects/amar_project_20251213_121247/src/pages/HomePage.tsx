import React from 'react';
import Hero from '../components/Hero';
import FeaturedDishes from '../components/FeaturedDishes';
import RestaurantHours from '../components/RestaurantHours';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page featuring a hero section, a showcase of featured dishes, and the restaurant's operating hours.</p>
        <Hero />
        <FeaturedDishes />
        <RestaurantHours />
      </div>
    </div>
  );
};

export default HomePage;
