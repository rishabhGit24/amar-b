import React from 'react';


interface AboutContentProps {
  sections?: string[];
}

const AboutContent: React.FC<AboutContentProps> = ({ sections = [] }) => {
  return (
    <div className="aboutcontent">
      <h2>AboutContent</h2>
      <p>Content block for the about page, detailing the pizzeria's story and values.</p>
    </div>
  );
};

export default AboutContent;
