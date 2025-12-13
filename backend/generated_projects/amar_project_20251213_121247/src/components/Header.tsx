import React from 'react';

// Define the structure for a single navigation link item
interface NavigationLink {
  label: string;
  path: string;
}

// Define the props for the Header component
// ALL props MUST be optional using '?'
interface HeaderProps {
  navigationLinks?: NavigationLink[];
}

// Default navigation links to be used if no props are provided
const defaultNavigationLinks: NavigationLink[] = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

/**
 * Global navigation header component providing links to different sections of the website.
 * All props are optional and have default values, allowing the component to be used as <Header />.
 */
const Header: React.FC<HeaderProps> = ({
  // Provide default value for navigationLinks if it's not passed
  navigationLinks = defaultNavigationLinks,
}) => {
  return (
    <header className="header-container" role="banner">
      <div className="header-content">
        {/* Logo or site title, linking to the homepage */}
        <a href="/" className="header-logo" aria-label="Go to homepage">
          MyCompany
        </a>

        {/* Main navigation area */}
        <nav className="header-nav" aria-label="Main navigation">
          <ul className="header-nav-list">
            {/* Map through the navigation links to render list items */}
            {navigationLinks.map((link) => (
              <li key={link.path} className="header-nav-item">
                {/* Use a standard anchor tag for navigation */}
                <a href={link.path} className="header-nav-link">
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