import React from 'react';


interface AboutContentProps {
  storyTitle?: string;
  storyText?: string;
  imageUrl?: string;
  altText?: string;
}

const AboutContent: React.FC<AboutContentProps> = ({ storyTitle = '', storyText = '', imageUrl = '', altText = '' }) => {
  return (
    <div className="aboutcontent">
      <h2>AboutContent</h2>
      <p>Presents the restaurant's history, philosophy, and unique story.</p>
    </div>
  );
};

export default AboutContent;
