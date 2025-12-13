import React from 'react';


interface AboutSectionProps {
  title: string;
  description: string;
  imageUrl: string;
}

const AboutSection: React.FC<AboutSectionProps> = (props: AboutSectionProps) => {
  return (
    <div className="aboutsection">
      <h2>AboutSection</h2>
      <p>Section detailing the cafe's ambiance and offerings.</p>
    </div>
  );
};

export default AboutSection;
