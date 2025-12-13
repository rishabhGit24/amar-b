import React from 'react';


interface HeaderProps {
  restaurantName?: string;
  navigationLinks?: { label: string; path: string; }[];
}

const Header: React.FC<HeaderProps> = ({ restaurantName = '', navigationLinks = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Top navigation bar with restaurant name/logo and links to different pages.</p>
    </div>
  );
};

export default Header;
