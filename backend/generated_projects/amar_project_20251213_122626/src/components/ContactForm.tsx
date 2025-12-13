import React from 'react';


interface ContactFormProps {
  title: string;
  submitEndpoint: string;
}

const ContactForm: React.FC<ContactFormProps> = (props: ContactFormProps) => {
  return (
    <div className="contactform">
      <h2>ContactForm</h2>
      <p>A contact form for inquiries.</p>
    </div>
  );
};

export default ContactForm;
