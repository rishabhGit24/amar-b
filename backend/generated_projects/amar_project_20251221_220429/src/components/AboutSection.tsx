import React from 'react';


interface AboutSectionProps {
  heading?: string;
  content?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ heading = '', content = '' }) => {
  return (
    <div className="aboutsection">
      <h2>AboutSection</h2>
      <p>Section detailing the coffee shop's story.</p>
    </div>
  );
};

export default AboutSection;
