import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import MenuSection from '../components/MenuSection';
import ContactForm from '../components/ContactForm';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page featuring a hero, brief about us, menu highlights, and a contact form.</p>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <ContactForm />
      </div>
    </div>
  );
};

export default HomePage;
