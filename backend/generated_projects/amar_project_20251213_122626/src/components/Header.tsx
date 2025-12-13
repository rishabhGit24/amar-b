import React from 'react';


interface HeaderProps {
  logoUrl: string;
  navLinks: Array<{label: string, href: string}>;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Sticky header with logo and navigation links.</p>
    </div>
  );
};

export default Header;
