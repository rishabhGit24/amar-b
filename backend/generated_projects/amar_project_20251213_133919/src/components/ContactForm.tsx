import React from 'react';


interface ContactFormProps {
  onSubmit?: (formData: {name: string, email: string, message: string}) => Promise<void>;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit = '' }) => {
  return (
    <div className="contactform">
      <h2>ContactForm</h2>
      <p>Form component for users to send messages, including name, email, and message fields.</p>
    </div>
  );
};

export default ContactForm;
