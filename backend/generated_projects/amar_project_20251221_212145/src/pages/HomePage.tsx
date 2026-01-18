import React from 'react';
import Hero from '../components/Hero';
import FeaturedItems from '../components/FeaturedItems';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page for Bella Napoli Pizzeria, featuring a prominent hero section, highlights of popular pizzas, and an inviting introduction to the restaurant.</p>
        <Hero />
        <FeaturedItems />
      </div>
    </div>
  );
};

export default HomePage;
