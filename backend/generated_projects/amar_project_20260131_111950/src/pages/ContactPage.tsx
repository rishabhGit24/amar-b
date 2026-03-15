import React, { useState } from "react";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MapSection from "../components/MapSection";

// Define types for the contact form data
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Define types for the API response
interface ContactFormResponse {
  success: boolean;
  message: string;
}

const ContactPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ContactFormResponse = await response.json();

      if (response.ok) {
        setSuccessMessage(
          result.message ||
            "Your message has been sent successfully! We will get back to you shortly.",
        );
      } else {
        setErrorMessage(
          result.message ||
            "Failed to send your message. Please check your details and try again.",
        );
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setErrorMessage(
        "An unexpected error occurred. Please check your internet connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        color: "#2d3748",
        backgroundColor: "#f7fafc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          padding: "100px 20px",
          textAlign: "center" as const,
          background: "linear-gradient(135deg, #e0f2f7 0%, #cce7f0 100%)",
          color: "#2d3748",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            marginBottom: "24px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Get In Touch With Us!
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            maxWidth: "800px",
            lineHeight: "1.8",
            opacity: 0.95,
          }}
        >
          We're here to help and answer any question you might have. We look
          forward to hearing from you. Whether you have a question about our
          services, need support, or just want to say hello, our dedicated team
          is ready to assist.
        </p>
      </section>

      {/* Contact Form Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          marginTop: "-50px",
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
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
          Send Us a Message ✉️
        </h2>
        {/* Assuming ContactForm accepts onSubmit, isLoading, errorMessage, successMessage props */}
        <ContactForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </section>

      {/* Why Contact Us Section (Feature Cards) */}
      <section
        style={{
          padding: "120px 20px 80px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#f7fafc",
          flexShrink: 0,
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
          Why Reach Out to AMAR? ✨
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          {/* Feature Card 1 */}
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
              <span style={{ fontSize: "2rem" }}>💡</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Expert Guidance
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Our team of specialists is ready to provide you with insightful
              advice and solutions tailored to your unique needs. Get the
              answers you need directly from the source, ensuring clarity and
              precision.
            </p>
          </div>

          {/* Feature Card 2 */}
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
                background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}></span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Swift Support
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Experience prompt and efficient support for all your inquiries. We
              value your time and strive for quick resolutions. Your
              satisfaction is our top priority, and we aim for rapid responses.
            </p>
          </div>

          {/* Feature Card 3 */}
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
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>⭐</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Personalized Solutions
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Every customer is unique, and so are our solutions. We listen to
              your needs and offer personalized approaches. Let's build
              something great together, tailored just for you.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          marginBottom: "80px",
          flexShrink: 0,
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
          Find Our Location 📍
        </h2>
        <MapSection /> {/* Using MapSection without props as per guidelines */}
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
