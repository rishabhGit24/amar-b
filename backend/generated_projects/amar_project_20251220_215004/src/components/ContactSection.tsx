import React from 'react';


interface ContactSectionProps {
  location?: string;
  hours?: string;
  socialLinks?: array;
}

const ContactSection: React.FC<ContactSectionProps> = ({ location = '', hours = '', socialLinks = [] }) => {
  return (
    <div className="contactsection">
      <h2>ContactSection</h2>
      <p>Section with contact details including location, opening hours, and social media links.</p>
    </div>
  );
};

export default ContactSection;
