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
      <p>Represents an individual food item on the menu, showing its name, description, price, and an optional image.</p>
    </div>
  );
};

export default MenuItem;
