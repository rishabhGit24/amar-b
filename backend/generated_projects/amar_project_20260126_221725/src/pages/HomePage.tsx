import React from "react";
import FeaturedItems from "../components/FeaturedItems";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

const HomePage: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif", // A modern, clean font for the entire page
        color: "#2d3748",
        lineHeight: 1.6,
        backgroundColor: "#f7fafc", // Light background for the whole page
        overflowX: "hidden", // Prevent horizontal scroll from shadows
      }}
    >
      <Header />

      {/* Main Hero Section - Combines the Hero component with custom content */}
      <div
        style={{
          position: "relative",
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "80px 20px",
          background: "linear-gradient(135deg, #e0f2f7 0%, #cce7f0 100%)", // Soft gradient background
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        {/* The Hero component itself, potentially for background or specific layout. Used without props. */}
        <Hero />

        {/* Content for the Hero Section, using the provided template styles */}
        <div
          style={{
            display: "flex",
            flexDirection: "column" as const,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            zIndex: 1, // Ensure content is above any background elements from Hero component
            maxWidth: "900px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              marginBottom: "24px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              color: "#2c5282",
            }}
          >
            Savor the Moment, Every Bite 🍽️
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              maxWidth: "700px",
              lineHeight: "1.8",
              opacity: 0.95,
              color: "#4a5568",
            }}
          >
            Discover an exquisite culinary journey with our handcrafted dishes,
            made with passion and the freshest ingredients. Your next
            unforgettable meal awaits.
          </p>
          <button
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "18px 48px",
              fontSize: "1.2rem",
              fontWeight: "600",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s ease",
              textTransform: "uppercase" as const,
              letterSpacing: "1px",
              marginTop: "40px",
            }}
          >
            Explore Our Menu
          </button>
        </div>
      </div>

      {/* Featured Menu Items Section - Uses CONTENT SECTIONS template */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          marginTop: "-60px", // Overlap with hero for a smoother transition
          position: "relative",
          zIndex: 2,
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
          Our Signature Delights ✨
        </h2>
        {/* The FeaturedItems component itself, potentially for a carousel or specific layout. Used without props. */}
        <FeaturedItems />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            marginTop: "40px", // Space between FeaturedItems component and custom cards
          }}
        >
          {/* Feature Card 1 - Uses FEATURE CARDS template */}
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
              <span style={{ fontSize: "2rem" }}>🍝</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Handcrafted Pasta Perfection
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Experience the rich flavors of Italy with our freshly made pasta,
              tossed in authentic sauces and premium ingredients. A true delight
              for your palate.
            </p>
          </div>

          {/* Feature Card 2 - Uses FEATURE CARDS template */}
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
                background: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)", // Different gradient
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>🍣</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Exquisite Sushi & Sashimi
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Dive into the delicate artistry of Japanese cuisine. Our sushi and
              sashimi are prepared with the freshest catch and expert precision.
            </p>
          </div>

          {/* Feature Card 3 - Uses FEATURE CARDS template */}
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
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)", // Different gradient
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>🍰</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Decadent Dessert Creations
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Conclude your meal with a symphony of sweetness. Our desserts are
              crafted to perfection, offering a delightful finish to any
              occasion.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Uses CONTENT SECTIONS template */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "80px auto", // More margin for separation
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // CTA specific gradient
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          textAlign: "center" as const,
          color: "white",
        }}
      >
        <h2
          style={{
            fontSize: "3.5rem",
            marginBottom: "30px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Ready to Indulge?
        </h2>
        <p
          style={{
            fontSize: "1.5rem",
            maxWidth: "800px",
            margin: "0 auto 50px auto",
            lineHeight: "1.8",
            opacity: 0.9,
          }}
        >
          Join us for an unforgettable dining experience. Reserve your table now
          or order online for a taste of excellence delivered to your door.
        </p>
        <button
          style={{
            background: "white", // Inverted button for CTA
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
          Make a Reservation
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
