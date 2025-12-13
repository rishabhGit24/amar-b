import React from 'react';

interface FooterProps {
  restaurantName?: string;
  year?: number;
}

const Footer: React.FC<FooterProps> = ({
  restaurantName = 'My Awesome Restaurant',
  year = new Date().getFullYear(),
}) => {
  return (
    <footer className="footer" aria-labelledby="footer-heading">
      {/* Visually hidden heading for accessibility, providing context for screen readers */}
      <h2 id="footer-heading" className="sr-only">Footer Navigation and Copyright Information</h2>
      <div className="footer-content">
        <p className="footer-copyright">
          &copy; {year} {restaurantName}. All rights reserved.
        </p>
        {/* Additional static links could be added here, e.g.: */}
        {/*
        <nav className="footer-links" aria-label="Footer Links">
          <ul>
            <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
            <li><a href="/terms" className="footer-link">Terms of Service</a></li>
            <li><a href="/contact" className="footer-link">Contact Us</a></li>
          </ul>
        </nav>
        */}
      </div>
    </footer>
  );
};

export default Footer;