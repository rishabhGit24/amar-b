import React from 'react';


interface AboutContentProps {
  storyTitle?: string;
  storyText?: string;
  imageUrls?: Array<string>;
}

const AboutContent: React.FC<AboutContentProps> = ({ storyTitle = '', storyText = '', imageUrls = '' }) => {
  return (
    <div className="aboutcontent">
      <h2>AboutContent</h2>
      <p>Content component for the About page, detailing the restaurant's history, philosophy, or unique story.</p>
    </div>
  );
};

export default AboutContent;
