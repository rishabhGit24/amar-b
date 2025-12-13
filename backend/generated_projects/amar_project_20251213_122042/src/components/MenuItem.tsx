import React from 'react';


interface MenuItemProps {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
  return (
    <div className="menuitem">
      <h2>MenuItem</h2>
      <p>Individual display for a menu item.</p>
    </div>
  );
};

export default MenuItem;
