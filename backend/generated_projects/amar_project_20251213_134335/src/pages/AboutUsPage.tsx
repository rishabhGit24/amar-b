import React from 'react';
import AboutContent from '../components/AboutContent';

const AboutUsPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>AboutUs</h1>
        <p>Dedicated page with detailed information about the coffee shop.</p>
        <AboutContent />
      </div>
    </div>
  );
};

export default AboutUsPage;
