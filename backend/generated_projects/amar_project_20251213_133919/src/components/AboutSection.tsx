import React from 'react';


interface AboutSectionProps {
  title?: string;
  content?: string;
  imageUrl?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title = '', content = '', imageUrl = '' }) => {
  return (
    <div className="aboutsection">
      <h2>AboutSection</h2>
      <p>Section detailing the coffee shop's story, mission, or unique selling points.</p>
    </div>
  );
};

export default AboutSection;
