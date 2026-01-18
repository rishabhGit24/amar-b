import React from 'react';
import HeroSection from '../components/HeroSection';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page with a welcoming hero section.</p>
        <HeroSection />
      </div>
    </div>
  );
};

export default HomePage;
