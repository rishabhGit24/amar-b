import React from 'react';


interface ContactFormProps {
  formTitle?: string;
  onSubmit?: (data: FormData) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ formTitle = '', onSubmit = undefined }) => {
  return (
    <div className="contactform">
      <h2>ContactForm</h2>
      <p>Form for users to send inquiries, requiring backend submission.</p>
    </div>
  );
};

export default ContactForm;
