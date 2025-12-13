import React from 'react';
import HeroSection from '../components/HeroSection';
import WhatIsAISection from '../components/WhatIsAISection';
import ApplicationsSection from '../components/ApplicationsSection';
import FutureOfAISection from '../components/FutureOfAISection';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Welcome</h1>
        <p>Single landing page providing an overview of AI with a stylish user interface.</p>
        <HeroSection />
        <WhatIsAISection />
        <ApplicationsSection />
        <FutureOfAISection />
      </div>
    </div>
  );
};

export default HomePage;
