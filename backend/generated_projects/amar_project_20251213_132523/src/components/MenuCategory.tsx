import React from 'react';


interface MenuCategoryProps {
  categoryName?: string;
  items?: Array<{name: string, description: string, price: string, imageUrl?: string}>;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ categoryName = '', items = '' }) => {
  return (
    <div className="menucategory">
      <h2>MenuCategory</h2>
      <p>A container component for a specific menu category (e.g., 'Appetizers'), displaying a list of menu items.</p>
    </div>
  );
};

export default MenuCategory;
