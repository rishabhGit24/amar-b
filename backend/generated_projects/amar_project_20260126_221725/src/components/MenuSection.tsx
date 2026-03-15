import React from 'react';


interface MenuSectionProps {
  menuCategories?: string[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuCategories = [] }) => {
  return (
    <div className="menusection">
      <h2>MenuSection</h2>
      <p>Displays different categories of menu items with individual cards.</p>
    </div>
  );
};

export default MenuSection;
