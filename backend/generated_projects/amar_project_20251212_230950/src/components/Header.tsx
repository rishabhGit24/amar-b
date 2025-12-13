import React from 'react';

interface NavLink {
  label: string;
  path: string;
}

interface HeaderProps {
  title?: string;
  navLinks?: NavLink[];
}

const Header: React.FC<HeaderProps> = ({
  title = 'My Awesome Site',
  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ],
}) => {
  return (
    <header className="site-header sticky top-0 z-50 bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <nav aria-label="Main navigation">
          <ul className="flex space-x-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <a
                  href={link.path}
                  className="hover:text-gray-300 transition-colors duration-200"
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