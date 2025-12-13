import React from 'react';

/**
 * @interface HeaderProps
 * Defines the props for the Header component.
 * All props are optional and have default values to ensure the component
 * can be used without any props: <Header />
 */
interface HeaderProps {
  /**
   * The main title displayed in the header.
   * @default 'My Awesome App'
   */
  title?: string;
  /**
   * Determines whether the navigation links should be displayed.
   * @default true
   */
  showNav?: boolean;
}

/**
 * Header component for application navigation.
 * Provides a customizable title and an optional navigation section.
 *
 * @param {HeaderProps} props - The properties for the Header component.
 * @returns {JSX.Element} The rendered header component.
 */
const Header: React.FC<HeaderProps> = ({
  title = 'My Awesome App', // Default title if none is provided
  showNav = true,           // Default to showing navigation if not specified
}) => {
  return (
    <header className="header-container" aria-label="Main application header">
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        {showNav && (
          <nav className="header-nav" aria-label="Main navigation">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="/" className="nav-link">Home</a>
              </li>
              <li className="nav-item">
                <a href="/about" className="nav-link">About</a>
              </li>
              <li className="nav-item">
                <a href="/services" className="nav-link">Services</a>
              </li>
              <li className="nav-item">
                <a href="/contact" className="nav-link">Contact</a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;