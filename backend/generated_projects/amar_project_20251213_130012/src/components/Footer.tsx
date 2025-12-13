import React from 'react';


interface FooterProps {
  copyrightText?: string;
  socialLinks?: { icon: string; url: string; }[];
}

const Footer: React.FC<FooterProps> = ({ copyrightText = '', socialLinks = '' }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Bottom section of the website, typically containing copyright and social media links.</p>
    </div>
  );
};

export default Footer;
