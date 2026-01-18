import React from 'react';
import MenuSection from '../components/MenuSection';

const MenuPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Menu</h1>
        <p>Displays the coffee shop's menu items.</p>
        <MenuSection />
      </div>
    </div>
  );
};

export default MenuPage;
