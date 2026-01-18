import React from 'react';


interface MenuListProps {
  menuItems?: string[];
}

const MenuList: React.FC<MenuListProps> = ({ menuItems = [] }) => {
  return (
    <div className="menulist">
      <h2>MenuList</h2>
      <p>Displays a list of menu items, categorized, with descriptions and prices.</p>
    </div>
  );
};

export default MenuList;
