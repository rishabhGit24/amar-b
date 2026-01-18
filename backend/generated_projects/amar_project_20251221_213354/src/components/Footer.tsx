import React from 'react';


interface FooterProps {
  copyright?: string;
  socialLinks?: string[];
}

const Footer: React.FC<FooterProps> = ({ copyright = '', socialLinks = [] }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Bottom section of the website containing copyright, contact info, and social media links.</p>
    </div>
  );
};

export default Footer;
