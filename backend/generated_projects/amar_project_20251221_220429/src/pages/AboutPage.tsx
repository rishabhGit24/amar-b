import React from 'react';
import AboutSection from '../components/AboutSection';

const AboutPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>About</h1>
        <p>Information about the coffee shop's history and mission.</p>
        <AboutSection />
      </div>
    </div>
  );
};

export default AboutPage;
