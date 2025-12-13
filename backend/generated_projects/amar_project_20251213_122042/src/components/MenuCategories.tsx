import React from 'react';


interface MenuCategoriesProps {
  categories: Array<{ name: string, items: Array<{ name: string, description: string, price: string }> }>;
}

const MenuCategories: React.FC<MenuCategoriesProps> = (props: MenuCategoriesProps) => {
  return (
    <div className="menucategories">
      <h2>MenuCategories</h2>
      <p>Container for displaying menu items grouped by category.</p>
    </div>
  );
};

export default MenuCategories;
