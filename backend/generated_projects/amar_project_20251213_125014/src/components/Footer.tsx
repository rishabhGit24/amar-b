import React from 'react';


interface FooterProps {
  shopName?: string;
  year?: number;
  socialLinks?: Array<{name: string, url: string}>;
}

const Footer: React.FC<FooterProps> = ({ shopName = '', year = 0, socialLinks = '' }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Standard footer with copyright and social media links.</p>
    </div>
  );
};

export default Footer;
