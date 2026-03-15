import React from 'react';


interface AboutContentProps {
  heading?: string;
  bodyText?: string;
  imageSrc?: string;
}

const AboutContent: React.FC<AboutContentProps> = ({ heading = '', bodyText = '', imageSrc = '' }) => {
  return (
    <div className="aboutcontent">
      <h2>AboutContent</h2>
      <p>Content area for the 'About Us' page, including text and images.</p>
    </div>
  );
};

export default AboutContent;
