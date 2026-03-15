import React from 'react';


interface AboutUsSectionProps {
  title?: string;
  content?: string;
  image?: string;
}

const AboutUsSection: React.FC<AboutUsSectionProps> = ({ title = '', content = '', image = '' }) => {
  return (
    <div className="aboutussection">
      <h2>AboutUsSection</h2>
      <p>Section detailing the coffee shop's story, mission, or unique selling points.</p>
    </div>
  );
};

export default AboutUsSection;
