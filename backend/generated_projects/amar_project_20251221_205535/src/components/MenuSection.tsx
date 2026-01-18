import React from 'react';


interface MenuSectionProps {
  menuItems?: string[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems = [] }) => {
  return (
    <div className="menusection">
      <h2>MenuSection</h2>
      <p>Section displaying the pizzeria's menu items with descriptions and prices.</p>
    </div>
  );
};

export default MenuSection;
