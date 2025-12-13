import React from 'react';


interface HeaderProps {
  siteTitle: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Top navigation bar displaying the site title or logo.</p>
    </div>
  );
};

export default Header;
