import React from 'react';

interface FooterProps {
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({ copyrightText }) => {
  const defaultCopyrightText = `© ${new Date().getFullYear()} Your Company Name. All rights reserved.`;
  const displayCopyrightText = copyrightText || defaultCopyrightText;

  return (
    <footer className="footer" aria-label="Footer">
      <p className="footer-text">{displayCopyrightText}</p>
    </footer>
  );
};

export default Footer;