import React from 'react';


interface MenuSectionProps {
  menuItems?: Array<{ name: string; description: string; price: string }>;
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems = '' }) => {
  return (
    <div className="menusection">
      <h2>MenuSection</h2>
      <p>Presents a simple preview of 3-4 popular menu items.</p>
    </div>
  );
};

export default MenuSection;
