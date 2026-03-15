import React from 'react';


interface MenuItemCardProps {
  item?: object;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item = {} }) => {
  return (
    <div className="menuitemcard">
      <h2>MenuItemCard</h2>
      <p>Card component for a single menu item, showing name, description, and price.</p>
    </div>
  );
};

export default MenuItemCard;
