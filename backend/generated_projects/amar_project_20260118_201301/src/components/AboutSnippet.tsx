import React from 'react';


interface AboutSnippetProps {
  shortDescription?: string;
  linkToAbout?: string;
  children?: React.ReactNode;
}

const AboutSnippet: React.FC<AboutSnippetProps> = ({ shortDescription = '', linkToAbout = '', children }) => {
  return (
    <div className="aboutsnippet">
      {children || (
        <>
          <h2>AboutSnippet</h2>
          <p>A brief introductory text about the coffee shop on the homepage with a link to the full About page.</p>
        </>
      )}
    </div>
  );
};

export default AboutSnippet;
