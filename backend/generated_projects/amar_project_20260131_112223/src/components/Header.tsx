import React from 'react';


interface HeaderProps {
  title?: string;
  showNav?: boolean;
  searchEnabled?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = '', showNav = false, searchEnabled = false }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header component with site title, navigation links, and search functionality.</p>
    </div>
  );
};

export default Header;
