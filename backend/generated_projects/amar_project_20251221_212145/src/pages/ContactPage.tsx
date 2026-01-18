import React from 'react';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';

const ContactPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Contact</h1>
        <p>Page providing a contact form for customer inquiries, along with essential contact details such as address, phone number, email, and opening hours.</p>
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  );
};

export default ContactPage;
