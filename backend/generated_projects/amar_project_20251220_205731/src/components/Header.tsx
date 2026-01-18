import React from 'react';


interface HeaderProps {
  shopName?: string;
  navigationLinks?: Array<{ label: string; path: string }>;
}

const Header: React.FC<HeaderProps> = ({ shopName = '', navigationLinks = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Displays the coffee shop's name and navigation links (minimal for a single page).</p>
    </div>
  );
};

export default Header;
