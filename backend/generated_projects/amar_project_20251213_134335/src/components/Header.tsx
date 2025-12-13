import React from 'react';


interface HeaderProps {
  brandName?: string;
  navigationLinks?: Array<{label: string, path: string}>;
}

const Header: React.FC<HeaderProps> = ({ brandName = '', navigationLinks = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Fancy navigation bar with branding and links to main pages.</p>
    </div>
  );
};

export default Header;
