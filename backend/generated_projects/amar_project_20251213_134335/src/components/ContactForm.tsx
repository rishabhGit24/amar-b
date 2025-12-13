import React from 'react';


interface ContactFormProps {
  heading?: string;
  onSubmit?: (formData: {name: string, email: string, message: string}) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ heading = '', onSubmit = '' }) => {
  return (
    <div className="contactform">
      <h2>ContactForm</h2>
      <p>Form for users to send messages to the coffee shop, requiring backend submission.</p>
    </div>
  );
};

export default ContactForm;
