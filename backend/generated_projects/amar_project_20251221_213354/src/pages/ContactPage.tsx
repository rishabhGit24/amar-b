import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';

// Type for the data submitted by the contact form
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Type for the API response
interface ContactApiResponse {
  success: boolean;
  message: string;
}

const ContactPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: ContactFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/contact', { // Using relative path for Vercel/Netlify deployment
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData: ContactApiResponse = await response.json();
        throw new Error(errorData.message || 'Failed to send inquiry.');
      }

      const result: ContactApiResponse = await response.json();
      setSuccessMessage(result.message || 'Your inquiry has been sent successfully!');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const
        }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
            Reach Out to Our Pizzeria! 🍕
          </h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}>
            Have a question, feedback, or a special request? We'd love to hear from you! Our team is ready to assist.
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
        marginTop: '-80px', // Overlap with hero for visual interest
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
          Find Us & Get in Touch
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
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
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // Different gradient
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>📍</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Our Location
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              123 Pizza Lane, Flavor Town, PIZZA 45678
              <br />
              Come visit us for the freshest slices!
            </p>
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
              background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // Different gradient
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
              Phone: <a href="tel:+1-555-PIZZERIA" style={{ color: '#667eea', textDecoration: 'none' }}>+1 (555) PIZZERIA</a>
              <br />
              Available during business hours for orders and inquiries.
            </p>
          </div>

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
              background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', // Different gradient
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
              Email: <a href="mailto:info@ourpizzeria.com" style={{ color: '#667eea', textDecoration: 'none' }}>info@ourpizzeria.com</a>
              <br />
              We aim to respond to all emails within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '800px',
        margin: '40px auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '40px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Send Us a Message ✍️
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Use the form below to send us your questions, comments, or suggestions. We value your input!
        </p>

        {isLoading && (
          <p style={{ color: '#667eea', fontSize: '1.1rem', marginBottom: '20px' }}>Sending your message...</p>
        )}
        {error && (
          <p style={{ color: '#e53e3e', fontSize: '1.1rem', marginBottom: '20px' }}>Error: {error}</p>
        )}
        {successMessage && (
          <p style={{ color: '#38a169', fontSize: '1.1rem', marginBottom: '20px' }}>{successMessage}</p>
        )}

        {/* Assuming ContactForm has onSubmit and isLoading props for integration */}
        <ContactForm onSubmit={handleSubmit} isLoading={isLoading} />
      </section>

      {/* Call to Action Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
        color: 'white',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '30px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Ready for Delicious Pizza? 🍕
        </h2>
        <p style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '0 auto 50px auto', lineHeight: '1.8' }}>
          While you're here, why not check out our amazing menu and place an order? We promise a delightful culinary experience!
        </p>
        <button style={{
          background: 'white',
          color: '#764ba2',
          padding: '18px 48px',
          fontSize: '1.2rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(255,255,255,0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px'
        }}>
          View Our Menu
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;