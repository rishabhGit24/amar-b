import React from 'react';


interface MenuItemProps {
  name?: string;
  description?: string;
  price?: string;
  imageUrl?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name = '', description = '', price = '', imageUrl = '' }) => {
  return (
    <div className="menuitem">
      <h2>MenuItem</h2>
      <p>Individual component to display a single menu item with its details.</p>
    </div>
  );
};

export default MenuItem;
