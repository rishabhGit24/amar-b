import React from 'react';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import ContactSection from '../components/ContactSection';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page for a pizzeria shop, showcasing menu and contact information.</p>
        <Hero />
        <MenuSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default HomePage;
