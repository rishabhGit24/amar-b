import React from 'react';


interface AboutSectionProps {
  title?: string;
  content?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title = '', content = '' }) => {
  return (
    <div className="aboutsection">
      <h2>AboutSection</h2>
      <p>Section providing information about the coffee shop.</p>
    </div>
  );
};

export default AboutSection;
