import React from 'react';


interface MenuDisplayProps {
  menuItems?: string[];
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menuItems = [] }) => {
  return (
    <div className="menudisplay">
      <h2>MenuDisplay</h2>
      <p>Component to display categories and individual menu items with descriptions and prices.</p>
    </div>
  );
};

export default MenuDisplay;
