import React from 'react';


interface HeaderProps {
  shopName?: string;
}

const Header: React.FC<HeaderProps> = ({ shopName = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation header with shop name</p>
    </div>
  );
};

export default Header;
