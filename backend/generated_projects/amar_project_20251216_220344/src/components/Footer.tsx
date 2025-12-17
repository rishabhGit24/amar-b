import React from 'react';


interface FooterProps {
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({ copyrightText = '' }) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Global footer component displaying copyright information and potentially other static links.</p>
    </div>
  );
};

export default Footer;
