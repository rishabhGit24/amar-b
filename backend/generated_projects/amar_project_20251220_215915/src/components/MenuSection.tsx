import React from 'react';


interface MenuSectionProps {
  menuItems?: array;
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems = [] }) => {
  return (
    <div className="menusection">
      <h2>MenuSection</h2>
      <p>Preview section for 3-4 menu items</p>
    </div>
  );
};

export default MenuSection;
