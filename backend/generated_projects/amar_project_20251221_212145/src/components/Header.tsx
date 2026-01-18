import React from 'react';


interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = '', showNav = false }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Responsive navigation header component featuring the pizzeria's logo, brand name, and links to the main sections of the website.</p>
    </div>
  );
};

export default Header;
