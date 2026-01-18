import React from 'react';


interface ContactFormProps {
  onSubmit?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit = undefined }) => {
  return (
    <div className="contactform">
      <h2>ContactForm</h2>
      <p>Form for users to send messages or inquiries to the pizzeria.</p>
    </div>
  );
};

export default ContactForm;
