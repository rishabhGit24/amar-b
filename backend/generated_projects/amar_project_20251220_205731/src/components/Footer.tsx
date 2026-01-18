import React from 'react';


interface FooterProps {
  shopName?: string;
  currentYear?: number;
}

const Footer: React.FC<FooterProps> = ({ shopName = '', currentYear = 0 }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>The standard footer component, typically containing copyright information and the shop's name.</p>
    </div>
  );
};

export default Footer;
