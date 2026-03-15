import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import MapDisplay from '../components/MapDisplay';

// Define types for the contact form data and API response
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

  const handleContactFormSubmit = async (formData: ContactFormData) => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', { // Use relative path for production deployment
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message.');
      }

      const result: ContactApiResponse = await response.json();
      setSuccessMessage(result.message || 'Your message has been sent successfully!');
    } catch (error) {
      let message = 'An unexpected error occurred. Please try again.';
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: string }).message === 'string') {
        message = (error as { message: string }).message;
      }
      console.error('Contact form submission error:', error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      color: '#2d3748',
      lineHeight: '1.6',
      backgroundColor: '#f7fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
    }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        minHeight: '400px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          Get In Touch With Us
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}>
          We're here to help! Whether you have a question, feedback, or just want to say hello, we'd love to hear from you.
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
        marginTop: '-80px', // Overlap with hero for visual effect
        position: 'relative',
        zIndex: 1,
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Our Contact Details
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
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
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
              Email Us
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              For general inquiries, support, or partnership opportunities, feel free to send us an email. We aim to respond within 24 hours.
            </p>
            <a href="mailto:info@amarsystem.com" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              marginTop: '15px',
              display: 'inline-block'
            }}>
              info@amarsystem.com
            </a>
          </div>

          {/* Phone Card */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
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
              <span style={{ fontSize: '2rem' }}>📞</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Call Us
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Prefer to speak with someone directly? Our friendly team is available during business hours to assist you.
            </p>
            <a href="tel:+1234567890" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              marginTop: '15px',
              display: 'inline-block'
            }}>
              +1 (234) 567-890
            </a>
          </div>

          {/* Address Card */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
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
              <span style={{ fontSize: '2rem' }}>📍</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Visit Our Office
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Stop by our headquarters for a coffee and a chat. We're located in the heart of innovation.
            </p>
            <address style={{
              fontStyle: 'normal',
              color: '#718096',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              marginTop: '15px'
            }}>
              123 AMAR Street, Suite 400<br />
              Tech City, TC 90210<br />
              United States
            </address>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1000px', // Slightly narrower for the form
        margin: '80px auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Send Us a Message
        </h2>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {isLoading && (
            <p style={{ textAlign: 'center' as const, color: '#667eea', fontSize: '1.2rem', marginBottom: '20px' }}>
              Sending your message...
            </p>
          )}
          {successMessage && (
            <p style={{ textAlign: 'center' as const, color: '#48bb78', fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600' }}>
              {successMessage} ✨
            </p>
          )}
          {errorMessage && (
            <p style={{ textAlign: 'center' as const, color: '#ef4444', fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600' }}>
              {errorMessage} 🚨
            </p>
          )}
          <ContactForm onSubmit={handleContactFormSubmit} />
        </div>
      </section>

      {/* Map Display Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '80px auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        marginBottom: '80px',
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Find Our Location
        </h2>
        <div style={{
          height: '500px', // Fixed height for the map
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <MapDisplay />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;