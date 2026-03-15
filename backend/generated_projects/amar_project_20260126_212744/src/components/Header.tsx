import React from 'react';


interface HeaderProps {
  shopName?: string;
  navLinks?: string[];
}

const Header: React.FC<HeaderProps> = ({ shopName = '', navLinks = [] }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header with the coffee shop's name and links to different sections of the page.</p>
    </div>
  );
};

export default Header;
