import React from 'react';


interface MenuItemProps {
  name?: string;
  description?: string;
  price?: string;
  imageUrl?: string;
  altText?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name = '', description = '', price = '', imageUrl = '', altText = '' }) => {
  return (
    <div className="menuitem">
      <h2>MenuItem</h2>
      <p>Displays details for a single food item, including its name, description, price, and an image.</p>
    </div>
  );
};

export default MenuItem;
