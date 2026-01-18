import React from 'react';
import AboutSection from '../components/AboutSection';

const AboutPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>About</h1>
        <p>Page detailing the coffee shop's story, philosophy, and potentially barista bios or sourcing information.</p>
        <AboutSection />
      </div>
    </div>
  );
};

export default AboutPage;
