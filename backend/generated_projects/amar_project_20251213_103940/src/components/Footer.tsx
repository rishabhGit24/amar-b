import React from 'react';


interface FooterProps {
  copyrightText: string;
}

const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Bottom section containing copyright information and potential static contact details or social media links.</p>
    </div>
  );
};

export default Footer;
