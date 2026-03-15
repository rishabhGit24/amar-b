import React from 'react';


interface HeaderProps {
  logoText?: string;
  navLinks?: string[];
}

const Header: React.FC<HeaderProps> = ({ logoText = '', navLinks = [] }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header component with logo/title and links to main pages.</p>
    </div>
  );
};

export default Header;
