import React from 'react';


interface ContactFormProps {
  onSubmit?: (data: any) => void | Promise<void>;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit = undefined }) => {
  return (
    <div className="contactform">
      <h2>ContactForm</h2>
      <p>Form for users to submit messages or inquiries to the coffee shop.</p>
    </div>
  );
};

export default ContactForm;
