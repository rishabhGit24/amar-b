import React from 'react';


interface HeaderProps {
  navLinks?: Array<{label: string, path: string}>;
  logoText?: string;
}

const Header: React.FC<HeaderProps> = ({ navLinks = '', logoText = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation bar with logo and links for internal page scrolling.</p>
    </div>
  );
};

export default Header;
