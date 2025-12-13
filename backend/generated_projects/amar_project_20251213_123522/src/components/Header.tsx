import React from 'react';


interface HeaderProps {
  siteName?: string;
  navLinks?: Array<{label: string, path: string}>;
}

const Header: React.FC<HeaderProps> = ({ siteName = '', navLinks = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header with site name and links.</p>
    </div>
  );
};

export default Header;
