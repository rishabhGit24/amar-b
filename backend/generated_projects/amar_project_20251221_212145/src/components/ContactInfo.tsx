import React from 'react';


interface ContactInfoProps {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string[];
}

const ContactInfo: React.FC<ContactInfoProps> = ({ address = '', phone = '', email = '', hours = [] }) => {
  return (
    <div className="contactinfo">
      <h2>ContactInfo</h2>
      <p>Displays essential contact information such as the physical address, phone number, email address, and detailed opening hours of the pizzeria.</p>
    </div>
  );
};

export default ContactInfo;
