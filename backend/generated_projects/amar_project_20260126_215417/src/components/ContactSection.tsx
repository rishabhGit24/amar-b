import React from 'react';


interface ContactSectionProps {
  address?: string;
  hours?: string;
  phone?: string;
  email?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ address = '', hours = '', phone = '', email = '' }) => {
  return (
    <div className="contactsection">
      <h2>ContactSection</h2>
      <p>Provides essential contact information such as address, opening hours, phone number, and email. It also includes a map and a contact form for customer inquiries.</p>
    </div>
  );
};

export default ContactSection;
