import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedDishes from '../components/FeaturedDishes';
import RestaurantHours from '../components/RestaurantHours';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page with a welcoming hero section, highlights of featured dishes, and restaurant operating hours.</p>
        <HeroSection />
        <FeaturedDishes />
        <RestaurantHours />
      </div>
    </div>
  );
};

export default HomePage;
