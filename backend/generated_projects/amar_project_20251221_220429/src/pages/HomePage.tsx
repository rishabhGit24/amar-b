import React from 'react';
import Hero from '../components/Hero';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page with hero section and general information.</p>
        <Hero />
      </div>
    </div>
  );
};

export default HomePage;
