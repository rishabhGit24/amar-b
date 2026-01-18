import React, { useState, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';

// Define types for the contact form data
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Define types for the API response
interface ContactApiResponse {
  success: boolean;
  message: string;
}

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: ContactFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/contact', { // Using relative path for Vercel/Netlify deployment
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit contact form.');
      }

      const result: ContactApiResponse = await response.json();
      setSuccess(result.message || 'Your message has been sent successfully!');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8f9fa' }}>
      <Header />

      <main style={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <section style={{
          padding: '100px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center' as const,
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
            Get In Touch With Us 🚀
          </h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.95 }}>
            We're here to answer your questions, provide support, and help you achieve your goals. Reach out today and let's connect!
          </p>
        </section>

        {/* Contact Form Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1000px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          marginTop: '-50px', // Overlap with hero for visual interest
          position: 'relative',
          zIndex: 10
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Send Us a Message ✨
          </h2>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <ContactForm onSubmit={handleSubmit} />
            {loading && (
              <p style={{ textAlign: 'center', color: '#667eea', marginTop: '20px', fontSize: '1.1rem' }}>
                Sending your message...
              </p>
            )}
            {error && (
              <p style={{ textAlign: 'center', color: '#e53e3e', marginTop: '20px', fontSize: '1.1rem', fontWeight: '600' }}>
                Error: {error}
              </p>
            )}
            {success && (
              <p style={{ textAlign: 'center', color: '#38a169', marginTop: '20px', fontSize: '1.1rem', fontWeight: '600' }}>
                Success: {success}
              </p>
            )}
          </div>
        </section>

        {/* Our Contact Details Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#f8f9fa'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Our Contact Details 💡
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
                For general inquiries, support, or partnership opportunities, feel free to drop us an email. We aim to respond within 24 hours.
              </p>
              <a href="mailto:info@yourcompany.com" style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                marginTop: '15px',
                display: 'inline-block',
                fontSize: '1.1rem'
              }}>
                info@yourcompany.com
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
                Need immediate assistance? Our friendly team is available to take your call during business hours.
              </p>
              <a href="tel:+1234567890" style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                marginTop: '15px',
                display: 'inline-block',
                fontSize: '1.1rem'
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
                We'd love to meet you! Our office is open Monday to Friday, 9 AM to 5 PM. Please schedule an appointment.
              </p>
              <address style={{
                fontStyle: 'normal',
                color: '#718096',
                marginTop: '15px',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                123 Innovation Drive<br />
                Suite 400, Tech City<br />
                TX 78701, USA
              </address>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;