import React from 'react';

interface NavLink {
  label: string;
  path: string;
}

interface HeaderProps {
  siteTitle?: string;
  navLinks?: NavLink[];
}

const Header: React.FC<HeaderProps> = ({
  siteTitle = 'My Awesome Site',
  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ],
}) => {
  return (
    <header className="site-header sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{siteTitle}</h1>
        <nav aria-label="Main navigation">
          <ul className="flex space-x-4">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.path}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  aria-current={window.location.pathname === link.path ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;