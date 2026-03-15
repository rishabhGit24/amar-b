import React from 'react';
import ContactForm from '../components/ContactForm';
import MapEmbed from '../components/MapEmbed';

const ContactPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Contact</h1>
        <p>Page with contact information, location map, and a form for inquiries.</p>
        <ContactForm />
        <MapEmbed />
      </div>
    </div>
  );
};

export default ContactPage;
