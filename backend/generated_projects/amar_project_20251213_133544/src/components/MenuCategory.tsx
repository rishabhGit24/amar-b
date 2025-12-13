import React from 'react';


interface MenuCategoryProps {
  title?: string;
  items?: { id: string, name: string, description: string, price: string, imageUrl: string }[];
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ title = '', items = '' }) => {
  return (
    <div className="menucategory">
      <h2>MenuCategory</h2>
      <p>Container component for a specific category of menu items (e.g., Appetizers, Mains).</p>
    </div>
  );
};

export default MenuCategory;
