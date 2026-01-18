import React from 'react';


interface ContactSectionProps {
  address?: string;
  phone?: string;
  email?: string;
  mapLink?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ address = '', phone = '', email = '', mapLink = '' }) => {
  return (
    <div className="contactsection">
      <h2>ContactSection</h2>
      <p>Section providing contact details, opening hours, and location map.</p>
    </div>
  );
};

export default ContactSection;
