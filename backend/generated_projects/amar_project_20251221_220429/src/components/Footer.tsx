import React from 'react';


interface FooterProps {
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({ copyrightText = '' }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Standard footer with copyright and basic links.</p>
    </div>
  );
};

export default Footer;
