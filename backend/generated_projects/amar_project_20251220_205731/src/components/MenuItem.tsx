import React from 'react';


interface MenuItemProps {
  name?: string;
  description?: string;
  price?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name = '', description = '', price = '' }) => {
  return (
    <div className="menuitem">
      <h2>MenuItem</h2>
      <p>A reusable component to display a single menu item with its name, description, and price.</p>
    </div>
  );
};

export default MenuItem;
