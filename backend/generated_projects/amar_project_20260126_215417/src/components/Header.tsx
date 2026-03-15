import React from 'react';


interface HeaderProps {
  cafeName?: string;
  navLinks?: string[];<object>;
}

const Header: React.FC<HeaderProps> = ({ cafeName = '', navLinks = [] }) => {
  return (
    <div className="header">
      <h2>Header</h2>
      <p>A responsive navigation bar at the top of the page, featuring the cafe's name or logo and links to different sections of the landing page (e.g., About, Menu, Contact).</p>
    </div>
  );
};

export default Header;
