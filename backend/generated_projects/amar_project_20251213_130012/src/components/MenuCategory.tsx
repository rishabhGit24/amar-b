import React from 'react';


interface MenuCategoryProps {
  categoryName?: string;
  items?: { name: string; description: string; price: string; imageUrl?: string; altText?: string; }[];
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ categoryName = '', items = '' }) => {
  return (
    <div className="menucategory">
      <h2>MenuCategory</h2>
      <p>A section for a specific menu category (e.g., Appetizers, Mains), containing multiple MenuItem components.</p>
    </div>
  );
};

export default MenuCategory;
