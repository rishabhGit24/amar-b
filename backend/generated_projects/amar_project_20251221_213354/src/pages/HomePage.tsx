import React from 'react';
import Hero from '../components/Hero';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page showcasing the pizzeria, its offerings, and a call to action.</p>
        <Hero />
      </div>
    </div>
  );
};

export default HomePage;
