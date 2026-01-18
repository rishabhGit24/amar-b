import React from 'react';


interface MenuHighlightsProps {
  highlightedItems?: string[];
  children?: React.ReactNode;
}

const MenuHighlights: React.FC<MenuHighlightsProps> = ({ highlightedItems = [], children }) => {
  return (
    <div className="menuhighlights">
      {children || (
        <>
          <h2>MenuHighlights</h2>
          <p>A section on the homepage to showcase a few popular or new menu items.</p>
        </>
      )}
    </div>
  );
};

export default MenuHighlights;
