import React from 'react';


interface AboutContentProps {
  title?: string;
  content?: string;
  imageUrl?: string;
}

const AboutContent: React.FC<AboutContentProps> = ({ title = '', content = '', imageUrl = '' }) => {
  return (
    <div className="aboutcontent">
      <h2>AboutContent</h2>
      <p>Content section for the About Us page, including rich text and images that tell the story of the pizzeria, its founders, and its commitment to quality ingredients.</p>
    </div>
  );
};

export default AboutContent;
