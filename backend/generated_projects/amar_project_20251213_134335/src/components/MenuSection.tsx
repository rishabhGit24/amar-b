import React from 'react';


interface MenuSectionProps {
  heading?: string;
  menuItems?: Array<{name: string, description: string, price: string}>;
}

const MenuSection: React.FC<MenuSectionProps> = ({ heading = '', menuItems = '' }) => {
  return (
    <div className="menusection">
      <h2>MenuSection</h2>
      <p>Highlights of the menu for the landing page.</p>
    </div>
  );
};

export default MenuSection;
