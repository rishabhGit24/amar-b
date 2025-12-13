import React from 'react';

interface HeaderProps {
  restaurantName?: string;
  navLinks?: Array<{ label: string; path: string }>;
}

const Header: React.FC<HeaderProps> = ({
  restaurantName = 'Delicious Eats',
  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
  ],
}) => {
  return (
    <header className="header">
      <div className="header-brand">
        {/* In a real application, this could be an <img> for a logo */}
        <span className="header-brand-name">{restaurantName}</span>
      </div>
      <nav className="header-nav" aria-label="Main restaurant navigation">
        <ul className="header-nav-list">
          {navLinks.map((link) => (
            <li key={link.path} className="header-nav-item">
              {/* Using <a> tags for basic navigation. For client-side routing (e.g., with React Router),
                  these would typically be replaced with a <Link> component from the router library. */}
              <a href={link.path} className="header-nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;