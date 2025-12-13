import React from 'react';


interface AboutStorySectionProps {
  title?: string;
  storyText?: string;
  imageUrl?: string;
}

const AboutStorySection: React.FC<AboutStorySectionProps> = ({ title = '', storyText = '', imageUrl = '' }) => {
  return (
    <div className="aboutstorysection">
      <h2>AboutStorySection</h2>
      <p>Section dedicated to presenting the restaurant's history, philosophy, or unique story.</p>
    </div>
  );
};

export default AboutStorySection;
