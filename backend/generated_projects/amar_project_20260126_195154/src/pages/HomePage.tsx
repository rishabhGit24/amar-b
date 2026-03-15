import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutUsSection from '../components/AboutUsSection';
import MenuShowcaseSection from '../components/MenuShowcaseSection';
import TestimonialsSection from '../components/TestimonialsSection';
import LocationHoursSection from '../components/LocationHoursSection';
import ContactFormSection from '../components/ContactFormSection';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Main landing page for the coffee shop, featuring a hero section, information about the shop, menu highlights, customer testimonials, location details, and a contact form.</p>
        <HeroSection />
        <AboutUsSection />
        <MenuShowcaseSection />
        <TestimonialsSection />
        <LocationHoursSection />
        <ContactFormSection />
      </div>
    </div>
  );
};

export default HomePage;
