import React from 'react';


interface AboutSectionProps {
  heading?: string;
  content?: string;
  image?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ heading = '', content = '', image = '' }) => {
  return (
    <div className="aboutsection">
      <h2>AboutSection</h2>
      <p>Section detailing the coffee shop's background.</p>
    </div>
  );
};

export default AboutSection;
