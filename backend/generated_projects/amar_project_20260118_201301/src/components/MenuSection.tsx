import React from 'react';


interface MenuSectionProps {
  menuItems?: string[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems = [] }) => {
  return (
    <div className="menusection">
      <h2>MenuSection</h2>
      <p>Displays a list of menu items, each with description and price.</p>
    </div>
  );
};

export default MenuSection;
