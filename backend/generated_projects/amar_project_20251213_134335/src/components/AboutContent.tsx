import React from 'react';


interface AboutContentProps {
  heading?: string;
  sections?: Array<{title: string, text: string}>;
}

const AboutContent: React.FC<AboutContentProps> = ({ heading = '', sections = '' }) => {
  return (
    <div className="aboutcontent">
      <h2>AboutContent</h2>
      <p>Detailed content for the dedicated About Us page.</p>
    </div>
  );
};

export default AboutContent;
