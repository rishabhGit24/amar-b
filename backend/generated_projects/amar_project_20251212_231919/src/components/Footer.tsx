import React from 'react';

interface SocialLink {
  icon: string;
  url: string;
}

interface FooterProps {
  copyrightText?: string;
  socialLinks?: SocialLink[];
}

const Footer: React.FC<FooterProps> = ({
  copyrightText = `© ${new Date().getFullYear()} Your Company Name. All rights reserved.`,
  socialLinks = [],
}) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">{copyrightText}</p>
        {socialLinks.length > 0 && (
          <div className="footer-social-links" aria-label="Social media links">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={`Follow us on ${link.icon}`}
              >
                {/* In a real application, you would use an icon component or SVG here */}
                {/* For this example, we'll just use the icon string as text */}
                {link.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;