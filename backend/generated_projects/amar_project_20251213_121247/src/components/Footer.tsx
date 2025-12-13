import React from 'react';

/**
 * @interface FooterProps
 * Defines the props for the Footer component.
 * All props are optional and have default values.
 */
interface FooterProps {
  /**
   * The main copyright text to display.
   * @default "All rights reserved."
   */
  copyrightText?: string;
  /**
   * The year for the copyright notice. Defaults to the current year.
   * @default new Date().getFullYear()
   */
  year?: number;
  /**
   * The name of the company for the copyright notice.
   * @default "Your Company Name"
   */
  companyName?: string;
  /**
   * An array of link objects to display in the footer.
   * Each object should have a `label` (display text) and a `url` (link destination).
   * An optional `ariaLabel` can be provided for improved accessibility for screen readers.
   * @default []
   */
  links?: Array<{ label: string; url: string; ariaLabel?: string }>;
}

/**
 * Footer component for displaying global copyright information and static links.
 * This component is designed to be production-ready, accessible, and highly configurable
 * with all props being optional and having sensible default values.
 *
 * @param {FooterProps} props - The properties for the Footer component.
 * @returns {JSX.Element} The rendered footer element.
 */
const Footer: React.FC<FooterProps> = ({
  copyrightText = 'All rights reserved.',
  year = new Date().getFullYear(), // Defaults to the current year
  companyName = 'Your Company Name',
  links = [], // Defaults to an empty array, so no links are displayed by default
}) => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        {/* Render navigation links only if the 'links' array is not empty */}
        {links.length > 0 && (
          <nav className="footer-nav" aria-label="Footer navigation">
            <ul className="footer-links">
              {links.map((link, index) => (
                <li key={index} className="footer-link-item">
                  <a
                    href={link.url}
                    className="footer-link"
                    // Open external links in a new tab for better user experience
                    target={link.url.startsWith('http') ? '_blank' : '_self'}
                    // Add rel="noopener noreferrer" for security when opening external links
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    // Provide an aria-label for accessibility, falling back to the link label
                    aria-label={link.ariaLabel || `Navigate to ${link.label}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {/* Copyright information */}
        <div className="footer-copyright">
          &copy; {year} {companyName}. {copyrightText}
        </div>
      </div>
    </footer>
  );
};

export default Footer;