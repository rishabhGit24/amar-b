import React from "react";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LocationMap from "../components/LocationMap";

const ContactPage: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        color: "#2d3748",
        backgroundColor: "#f7fafc",
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          padding: "120px 20px",
          textAlign: "center" as const,
          background: "linear-gradient(135deg, #e0f2f7 0%, #cce7f0 100%)",
          color: "#2d3748",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
        }}
      >
        <div
          style={{
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
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Get In Touch With Us
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              maxWidth: "800px",
              lineHeight: "1.8",
              opacity: 0.95,
              color: "#4a5568",
            }}
          >
            We're here to answer your questions, provide support, and help you
            with anything you need. Reach out today and let's connect!
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
          marginTop: "-60px", // Overlap with hero for visual interest
          position: "relative" as const,
          zIndex: 1,
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
          Our Contact Details
        </h2>
        <ContactSection />
      </section>

      {/* Location Map Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#f7fafc",
          marginTop: "40px",
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
          Find Our Location
        </h2>
        <LocationMap />
      </section>

      {/* Our Commitment Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
          marginTop: "80px",
          marginBottom: "80px",
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
          Our Commitment to You ✨
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
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
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
              Prompt Responses
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              We value your time and strive to respond to all inquiries within
              24 hours, ensuring you get the answers you need quickly.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              border: "1px solid #e2e8f0",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
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
              Our team of specialists is ready to provide knowledgeable and
              helpful advice, guiding you through every step.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              border: "1px solid #e2e8f0",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
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
              Personalized Support
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Every interaction is tailored to your specific needs, ensuring a
              unique and satisfying experience with us.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        style={{
          padding: "100px 20px",
          textAlign: "center" as const,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          marginBottom: "0px",
        }}
      >
        <h2
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "24px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Ready to Connect?
        </h2>
        <p
          style={{
            fontSize: "1.5rem",
            maxWidth: "700px",
            lineHeight: "1.8",
            opacity: 0.95,
            margin: "0 auto 40px auto",
          }}
        >
          Don't hesitate to reach out. We're eager to assist you and look
          forward to hearing from you soon!
        </p>
        <button
          style={{
            background: "white",
            color: "#667eea",
            padding: "18px 48px",
            fontSize: "1.2rem",
            fontWeight: "600",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
          }}
        >
          Send Us a Message
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
