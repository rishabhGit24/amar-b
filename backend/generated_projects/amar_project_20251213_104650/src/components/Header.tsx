import React from 'react';


interface HeaderProps {
  siteTitle: string;
  logoUrl: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Top navigation bar with site title and optional logo.</p>
    </div>
  );
};

export default Header;
