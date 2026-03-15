import React from 'react';


interface MenuItemProps {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name = '', description = '', price = 0, image = '' }) => {
  return (
    <div className="menuitem">
      <h2>MenuItem</h2>
      <p>Displays a single menu item with its details.</p>
    </div>
  );
};

export default MenuItem;
