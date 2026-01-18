import React from 'react';


interface HeaderProps {
  pizzeriaName?: string;
  showNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({ pizzeriaName = '', showNav = false }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header component with pizzeria name and links to sections.</p>
    </div>
  );
};

export default Header;
