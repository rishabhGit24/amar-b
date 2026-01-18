import React from 'react';


interface ContactSectionProps {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string[];
}

const ContactSection: React.FC<ContactSectionProps> = ({ address = '', phone = '', email = '', hours = [] }) => {
  return (
    <div className="contactsection">
      <h2>ContactSection</h2>
      <p>Displays contact details and opening hours.</p>
    </div>
  );
};

export default ContactSection;
