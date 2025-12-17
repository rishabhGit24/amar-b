import React from 'react';


interface HeaderProps {
  shopName?: string;
  navLinks?: Array<{ label: string; path: string; }>;
}

const Header: React.FC<HeaderProps> = ({ shopName = '', navLinks = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Global navigation header with the shop's name/logo and links to different pages.</p>
    </div>
  );
};

export default Header;
