import React from 'react';
import ContactSection from '../components/ContactSection';

const ContactPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Contact</h1>
        <p>Page with contact information, location details, and a contact form for inquiries.</p>
        <ContactSection />
      </div>
    </div>
  );
};

export default ContactPage;
