import React from 'react';


interface ContactFormProps {
  onSubmit?: function;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit = undefined }) => {
  return (
    <div className="contactform">
      <h2>ContactForm</h2>
      <p>Interactive form allowing users to send messages, inquiries, or feedback to the pizzeria, typically including fields for name, email, subject, and message.</p>
    </div>
  );
};

export default ContactForm;
