import React from 'react';


interface HeaderProps {
  shopName?: string;
  navigationLinks?: string[];
}

const Header: React.FC<HeaderProps> = ({ shopName = '', navigationLinks = [] }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header component with shop name and links.</p>
    </div>
  );
};

export default Header;
