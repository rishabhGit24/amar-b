import React from 'react';


interface FooterProps {
  copyrightText: string;
  socialLinks: Array<{icon: string, url: string}>;
}

const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  return (
    <div className="footer">
      <h2>Footer</h2>
      <p>Footer with copyright information and social media links.</p>
    </div>
  );
};

export default Footer;
