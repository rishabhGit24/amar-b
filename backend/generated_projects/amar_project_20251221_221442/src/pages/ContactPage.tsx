import React, { useState } from 'react';
import Header from '../components/Header';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactApiResponse {
  success: boolean;
  message: string;
}

const ContactPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: ContactFormData) => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message.');
      }

      const result: ContactApiResponse = await response.json();
      setSuccessMessage(result.message || 'Your message has been sent successfully!');
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      color: '#2d3748',
      backgroundColor: '#f7fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #e0f2f7 0%, #cce7f0 100%)',
        color: '#2d3748',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
          Get in Touch with Us! 💬
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.95 }}>
          We're here to help and answer any question you might have. We look forward to hearing from you.
        </p>
      </section>

      {/* Contact Information Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        marginTop: '-50px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Reach Out to Our Team 🚀
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {/* Email Card */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>📧</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Email Us Directly
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              For general inquiries, support, or partnership opportunities, feel free to send us an email. We aim to respond within 24 hours.
            </p>
            <p style={{ color: '#4a5568', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '20px' }}>
              <a href="mailto:info@amarsystem.com" style={{ color: '#667eea', textDecoration: 'none' }}>info@amarsystem.com</a>
            </p>
          </div>

          {/* Phone Card */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>📞</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Call Our Support Line
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Need immediate assistance? Our friendly support team is available during business hours to help you.
            </p>
            <p style={{ color: '#4a5568', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '20px' }}>
              <a href="tel:+1234567890" style={{ color: '#ed8936', textDecoration: 'none' }}>+1 (234) 567-890</a>
            </p>
          </div>

          {/* Address Card */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>📍</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Visit Our Office
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              If you prefer a face-to-face discussion, our office is open by appointment. We'd love to meet you!
            </p>
            <p style={{ color: '#4a5568', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '20px' }}>
              123 AMAR Street, Suite 400<br />
              Innovation City, IC 98765
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '900px',
        margin: '60px auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        textAlign: 'center' as const,
        flexGrow: 1
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '40px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Send Us a Message ✨
        </h2>
        <p style={{ color: '#718096', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto' }}>
          Have a question, feedback, or a project idea? Fill out the form below and we'll get back to you as soon as possible.
        </p>

        {isLoading && (
          <p style={{ color: '#667eea', fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600' }}>
            Sending your message... Please wait.
          </p>
        )}
        {successMessage && (
          <p style={{ color: '#48bb78', fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600' }}>
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p style={{ color: '#e53e3e', fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600' }}>
            {errorMessage}
          </p>
        )}

        <ContactForm onSubmit={handleSubmit} />
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;