import React from 'react';


interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children = undefined }) => {
  return (
    <div className="layout">
      <h2>Layout</h2>
      <p>A wrapper component providing a consistent layout structure, including the Header and Footer.</p>
    </div>
  );
};

export default Layout;
