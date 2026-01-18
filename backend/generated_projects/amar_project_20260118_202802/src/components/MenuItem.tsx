import React from 'react';


interface MenuItemProps {
  name?: string;
  description?: string;
  price?: string;
  image?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name = '', description = '', price = '', image = '' }) => {
  return (
    <div className="menuitem">
      <h2>MenuItem</h2>
      <p>Component to display details of a single menu item.</p>
    </div>
  );
};

export default MenuItem;
