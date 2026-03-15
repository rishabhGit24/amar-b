import React from 'react';


interface HeaderProps {
  logoText?: string;
  navLinks?: string[];
}

const Header: React.FC<HeaderProps> = ({ logoText = '', navLinks = [] }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header component with coffee shop logo/name and links to different sections of the page.</p>
    </div>
  );
};

export default Header;
