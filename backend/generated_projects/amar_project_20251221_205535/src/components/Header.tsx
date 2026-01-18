import React from 'react';


interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = '', showNav = false }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header component with pizzeria name/logo and links.</p>
    </div>
  );
};

export default Header;
