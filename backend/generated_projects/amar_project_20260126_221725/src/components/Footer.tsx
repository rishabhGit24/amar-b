import React from 'react';


interface FooterProps {
  socialLinks?: string[];
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({ socialLinks = [], copyrightText = '' }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Footer component with copyright information and social media links.</p>
    </div>
  );
};

export default Footer;
