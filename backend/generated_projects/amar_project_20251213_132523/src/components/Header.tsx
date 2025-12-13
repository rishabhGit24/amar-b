import React from 'react';


interface HeaderProps {
  navigationLinks?: Array<{label: string, path: string}>;
}

const Header: React.FC<HeaderProps> = ({ navigationLinks = '' }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Global navigation header with restaurant logo/name and links to main pages.</p>
    </div>
  );
};

export default Header;
