import React from 'react';
import MenuSection from '../components/MenuSection';

const MenuPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Menu</h1>
        <p>Dedicated page displaying the full menu of coffee, beverages, and food items.</p>
        <MenuSection />
      </div>
    </div>
  );
};

export default MenuPage;
