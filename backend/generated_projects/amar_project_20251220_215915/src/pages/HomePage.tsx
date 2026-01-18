import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import MenuSection from '../components/MenuSection';
import ContactSection from '../components/ContactSection';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page for Brew Haven coffee shop</p>
        <HeroSection />
        <FeaturesSection />
        <MenuSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default HomePage;
