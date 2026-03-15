import React from 'react';


interface AboutContentProps {
  sections?: string[];
}

const AboutContent: React.FC<AboutContentProps> = ({ sections = [] }) => {
  return (
    <div className="aboutcontent">
      <h2>AboutContent</h2>
      <p>Content area for the about page, structured into multiple sections.</p>
    </div>
  );
};

export default AboutContent;
