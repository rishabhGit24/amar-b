import React from 'react';


interface ContactFormProps {
  onSubmit?: function;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit = undefined }) => {
  return (
    <div className="contactform">
      <h2>ContactForm</h2>
      <p>Form for users to send messages to the pizza shop.</p>
    </div>
  );
};

export default ContactForm;
