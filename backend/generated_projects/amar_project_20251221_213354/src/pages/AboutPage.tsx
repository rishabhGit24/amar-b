import React from 'react';
import AboutContent from '../components/AboutContent';

const AboutPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>About</h1>
        <p>Information about the pizzeria's history, mission, and values.</p>
        <AboutContent />
      </div>
    </div>
  );
};

export default AboutPage;
