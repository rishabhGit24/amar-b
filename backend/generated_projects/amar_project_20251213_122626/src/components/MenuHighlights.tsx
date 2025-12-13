import React from 'react';


interface MenuHighlightsProps {
  title: string;
  menuItems: Array<{name: string, description: string, price: string, imageUrl?: string}>;
}

const MenuHighlights: React.FC<MenuHighlightsProps> = (props: MenuHighlightsProps) => {
  return (
    <div className="menuhighlights">
      <h2>MenuHighlights</h2>
      <p>Showcases a few signature cafe dishes.</p>
    </div>
  );
};

export default MenuHighlights;
