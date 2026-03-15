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
      <p>A section dedicated to telling the cafe's story, its philosophy, history, and what makes it unique. Includes descriptive text and an accompanying image.</p>
    </div>
  );
};

export default AboutSection;
