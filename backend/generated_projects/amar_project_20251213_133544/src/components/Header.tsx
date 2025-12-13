import React from 'react';


interface HeaderProps {
  navigationLinks?: { label: string, path: string }[];
}

const Header: React.FC<HeaderProps> = ({ navigationLinks = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Global navigation bar with links to different pages.</p>
    </div>
  );
};

export default Header;
