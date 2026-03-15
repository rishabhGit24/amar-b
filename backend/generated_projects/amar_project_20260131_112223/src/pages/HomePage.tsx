import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoriesOverview from '../components/CategoriesOverview';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page showcasing featured products and categories for an e-commerce company.</p>
        <Hero />
        <FeaturedProducts />
        <CategoriesOverview />
      </div>
    </div>
  );
};

export default HomePage;
