import React from 'react';
import AboutContent from '../components/AboutContent';

const AboutPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>About</h1>
        <p>Page dedicated to the history, philosophy, and story of Bella Napoli Pizzeria, emphasizing its authentic Italian heritage and commitment to quality.</p>
        <AboutContent />
      </div>
    </div>
  );
};

export default AboutPage;
