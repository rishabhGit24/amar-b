import React from 'react';


interface FooterProps {
  copyrightText?: string;
  socialLinks?: Array<{name: string, url: string}>;
}

const Footer: React.FC<FooterProps> = ({ copyrightText = '', socialLinks = '' }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Standard footer component with copyright and social media links.</p>
    </div>
  );
};

export default Footer;
