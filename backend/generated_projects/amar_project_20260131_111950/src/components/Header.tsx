import React from 'react';


interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = '', showNav = false }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header component with cafe branding.</p>
    </div>
  );
};

export default Header;
