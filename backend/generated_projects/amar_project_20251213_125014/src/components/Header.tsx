import React from 'react';


interface HeaderProps {
  shopName?: string;
  navLinks?: Array<{label: string, path: string}>;
}

const Header: React.FC<HeaderProps> = ({ shopName = '', navLinks = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header with shop name and links to sections.</p>
    </div>
  );
};

export default Header;
