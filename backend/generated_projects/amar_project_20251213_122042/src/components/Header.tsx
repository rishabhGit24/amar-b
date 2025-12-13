import React from 'react';


interface HeaderProps {
  title: string;
  navLinks: Array<{ label: string, path: string }>;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>Navigation bar with restaurant title and links to different pages.</p>
    </div>
  );
};

export default Header;
