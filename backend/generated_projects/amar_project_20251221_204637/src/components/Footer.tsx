import React from 'react';


interface FooterProps {
  copyrightText?: string;
  privacyPolicyLink?: string;
}

const Footer: React.FC<FooterProps> = ({ copyrightText = '', privacyPolicyLink = '' }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Standard footer component with copyright and legal links.</p>
    </div>
  );
};

export default Footer;
