import React from 'react';


interface AboutSectionProps {
  title?: string;
  description?: string;
  image?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title = '', description = '', image = '' }) => {
  return (
    <div className="aboutsection">
      <h2>AboutSection</h2>
      <p>Section providing information about the cafe's story and mission.</p>
    </div>
  );
};

export default AboutSection;
