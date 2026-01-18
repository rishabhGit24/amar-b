import React from 'react';


interface ContactFormProps {
  onSubmit?: (data: any) => void | Promise<void>;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit = undefined }) => {
  return (
    <div className="contactform">
      <h2>ContactForm</h2>
      <p>Form component for users to submit messages or inquiries, including fields for name, email, and message.</p>
    </div>
  );
};

export default ContactForm;
