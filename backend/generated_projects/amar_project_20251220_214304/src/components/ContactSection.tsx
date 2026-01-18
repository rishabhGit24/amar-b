import React from 'react';


interface ContactSectionProps {
  location?: string;
  hours?: array;
  socialLinks?: array;
}

const ContactSection: React.FC<ContactSectionProps> = ({ location = '', hours = [], socialLinks = [] }) => {
  return (
    <div className="contactsection">
      <h2>ContactSection</h2>
      <p>Section with location, hours, and social media links</p>
    </div>
  );
};

export default ContactSection;
