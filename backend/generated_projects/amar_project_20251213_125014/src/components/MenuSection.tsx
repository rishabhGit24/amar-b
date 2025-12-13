import React from 'react';


interface MenuSectionProps {
  menuItems?: Array<{id: string, name: string, description: string, price: string}>;
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems = '' }) => {
  return (
    <div className="menusection">
      <h2>MenuSection</h2>
      <p>Displays the coffee shop's menu items.</p>
    </div>
  );
};

export default MenuSection;
