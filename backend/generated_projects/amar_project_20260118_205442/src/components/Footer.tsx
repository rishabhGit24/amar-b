import React from 'react';


interface FooterProps {
  copyrightText?: string;
  socialMediaLinks?: string[];
}

const Footer: React.FC<FooterProps> = ({ copyrightText = '', socialMediaLinks = [] }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Standard footer containing copyright information and links to social media.</p>
    </div>
  );
};

export default Footer;
