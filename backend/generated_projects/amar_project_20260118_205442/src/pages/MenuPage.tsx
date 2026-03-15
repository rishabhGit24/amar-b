import React from "react";
import Footer from "../components/Footer";
import FullMenuDisplay from "../components/FullMenuDisplay";
import Header from "../components/Header";

const MenuPage: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        color: "#2d3748",
        backgroundColor: "#f7fafc",
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          padding: "100px 20px",
          textAlign: "center" as const,
          background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",
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
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              color: "#2d3748",
            }}
          >
            Savor Every Moment: Our Exquisite Menu ☕
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
            Explore a delightful array of handcrafted coffees, gourmet pastries,
            and savory bites, all prepared with passion and the finest
            ingredients. Your perfect culinary journey begins here.
          </p>
        </div>
      </section>

      {/* Main Menu Display Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          marginTop: "-60px", // Overlap with hero for visual interest
          position: "relative" as const,
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontSize: "3.5rem",
            textAlign: "center" as const,
            marginBottom: "60px",
            color: "#2d3748",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Our Full Selection of Delights ✨
        </h2>
        <FullMenuDisplay />
      </section>

      {/* Our Promise / Why Choose Us Section */}
      <section
        style={{
          padding: "100px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#f7fafc",
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
          More Than Just a Menu: Our Commitment to Quality 💡
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
              <span style={{ fontSize: "2rem" }}>🌱</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Freshly Roasted Beans
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              We source premium beans globally, roasted in-house to perfection,
              ensuring every cup is rich, aromatic, and unforgettable.
              Experience the true essence of coffee.
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
                background: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>🥐</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Artisan Crafted Delights
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              From flaky croissants to decadent cakes, our pastries are baked
              fresh daily by skilled artisans, using only the finest, natural
              ingredients. A treat for every palate.
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
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>🌍</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Sustainable & Ethical Sourcing
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              We believe in responsible practices, partnering with farms that
              prioritize sustainability and fair trade, for a taste you can feel
              good about.
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
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
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
          Ready to Indulge?
        </h2>
        <p
          style={{
            fontSize: "1.5rem",
            maxWidth: "700px",
            lineHeight: "1.8",
            opacity: 0.95,
            marginBottom: "40px",
          }}
        >
          Visit us today to experience the full ambiance and taste the
          difference. We can't wait to welcome you!
        </p>
        <button
          style={{
            background: "white",
            color: "#764ba2",
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
          Find Our Location
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;
