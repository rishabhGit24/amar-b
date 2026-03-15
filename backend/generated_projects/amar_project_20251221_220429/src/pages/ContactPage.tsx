import React, { useState } from "react";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Header from "../components/Header";

// Define the expected data structure for the contact form submission
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Define the expected API response structure
interface ContactApiResponse {
  success: boolean;
  message: string;
}

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (formData: ContactFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/contact", {
        // Using relative path for Vercel/Netlify deployment
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result: ContactApiResponse = await response.json();

      if (response.ok) {
        setSuccess(
          result.message || "Your message has been sent successfully!",
        );
      } else {
        setError(
          result.message || "Failed to send your message. Please try again.",
        );
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      setError(
        "An unexpected error occurred. Please check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        color: "#2d3748",
        background: "#f7fafc",
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          padding: "100px 20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            marginBottom: "24px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Get In Touch With Us!
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            maxWidth: "700px",
            lineHeight: "1.8",
            opacity: 0.95,
          }}
        >
          We're here to help and answer any question you might have. We look
          forward to hearing from you.
        </p>
      </section>

      {/* Contact Information Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          marginTop: "-50px", // Overlap with hero for a modern look
          position: "relative",
          boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "3rem",
            textAlign: "center" as const,
            marginBottom: "60px",
            color: "#2d3748",
            fontWeight: "bold",
          }}
        >
          How Can We Assist You? 💡
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          {/* Feature Card 1: General Inquiries */}
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              border: "1px solid #e2e8f0",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>📧</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              General Inquiries
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Have a question about our services or just want to say hello? Drop
              us a line and we'll get back to you promptly.
            </p>
          </div>

          {/* Feature Card 2: Support & Help */}
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              border: "1px solid #e2e8f0",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>🛠️</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Technical Support
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Experiencing an issue or need technical assistance? Our dedicated
              support team is ready to help you resolve it.
            </p>
          </div>

          {/* Feature Card 3: Partnerships */}
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              border: "1px solid #e2e8f0",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>🤝</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Partnership Opportunities
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Interested in collaborating or exploring partnership
              opportunities? Let's connect and build something great together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "800px",
          margin: "60px auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h2
          style={{
            fontSize: "3rem",
            textAlign: "center" as const,
            marginBottom: "40px",
            color: "#2d3748",
            fontWeight: "bold",
          }}
        >
          Send Us a Message ✨
        </h2>

        {loading && (
          <p
            style={{
              textAlign: "center",
              color: "#667eea",
              fontSize: "1.2rem",
              marginBottom: "20px",
            }}
          >
            Sending your message...
          </p>
        )}
        {error && (
          <p
            style={{
              textAlign: "center",
              color: "#e53e3e",
              fontSize: "1.2rem",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            Error: {error}
          </p>
        )}
        {success && (
          <p
            style={{
              textAlign: "center",
              color: "#38a169",
              fontSize: "1.2rem",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            Success: {success}
          </p>
        )}

        <ContactForm onSubmit={handleSubmit} />

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#718096",
            fontSize: "1rem",
          }}
        >
          <p>Prefer to reach us directly?</p>
          <p>
            Email:{" "}
            <a
              href="mailto:info@amarsystem.com"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              info@amarsystem.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a
              href="tel:+1234567890"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              +1 (234) 567-890
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
