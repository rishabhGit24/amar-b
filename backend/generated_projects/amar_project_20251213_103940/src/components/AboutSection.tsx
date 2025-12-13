import React from 'react';


interface AboutSectionProps {
  title: string;
  content: string;
}

const AboutSection: React.FC<AboutSectionProps> = (props: AboutSectionProps) => {
  return (
    <div className="aboutsection">
      <h2>AboutSection</h2>
      <p>Core content section providing detailed information about 'i'.</p>
    </div>
  );
};

export default AboutSection;
