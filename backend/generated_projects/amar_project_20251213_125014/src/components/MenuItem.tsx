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
      <p>Individual menu item component.</p>
    </div>
  );
};

export default MenuItem;
