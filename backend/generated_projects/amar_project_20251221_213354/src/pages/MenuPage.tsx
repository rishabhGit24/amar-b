import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MenuList from "../components/MenuList";

const MenuPage: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif", // Modern font choice
        color: "#333",
        backgroundColor: "#f8f8f8", // Light background for the whole page
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        overflowX: "hidden", // Prevent horizontal scroll
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          padding: "100px 20px",
          textAlign: "center" as const,
          background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
          color: "#2d3748",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center" as const,
          alignItems: "center" as const,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            marginBottom: "24px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            color: "#4a5568",
          }}
        >
          Savor Our Delicious Menu 🍕
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
          Explore a world of authentic Italian flavors, from classic pizzas to
          gourmet delights, crafted with the freshest ingredients and a passion
          for perfection.
        </p>
        <button
          style={{
            background: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)", // Red gradient for menu
            color: "white",
            padding: "18px 48px",
            fontSize: "1.2rem",
            fontWeight: "600",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(229, 62, 62, 0.4)",
            transition: "all 0.3s ease",
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
            marginTop: "40px",
          }}
        >
          View Today's Specials ✨
        </button>
      </section>

      {/* Menu List Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          marginTop: "-50px", // Overlap with hero for visual interest
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
          Our Irresistible Offerings 🍝
        </h2>
        {/* The MenuList component will display the actual menu items */}
        <MenuList />
      </section>

      {/* Why Choose Us Section (Features) */}
      <section
        style={{
          padding: "100px 20px",
          maxWidth: "1200px",
          margin: "60px auto",
          background: "#fdfdfd",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
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
          Why Our Pizzeria Stands Out 🌟
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          {/* Feature Card 1: Fresh Ingredients */}
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "flex-start" as const,
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)", // Orange gradient
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>🍅</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Farm-Fresh Ingredients
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              We source only the finest, freshest local produce and premium
              meats to ensure every bite is bursting with natural flavor and
              quality.
            </p>
          </div>

          {/* Feature Card 2: Authentic Recipes */}
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "flex-start" as const,
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)", // Green gradient
                borderRadius: "15px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center" as const,
                justifyContent: "center" as const,
              }}
            >
              <span style={{ fontSize: "2rem" }}>👨‍🍳</span>
            </div>
            <h3
              style={{
                fontSize: "1.8rem",
                color: "#2d3748",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              Authentic Italian Recipes
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Our chefs follow time-honored Italian traditions, crafting each
              dish with passion and expertise to bring you an unforgettable
              culinary experience.
            </p>
          </div>

          {/* Feature Card 3: Speedy Delivery */}
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "flex-start" as const,
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #63b3ed 0%, #4299e1 100%)", // Blue gradient
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
              Speedy & Reliable Delivery
            </h3>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              Craving pizza now? Our efficient delivery team ensures your hot,
              fresh meal arrives at your doorstep quickly and safely.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        style={{
          padding: "80px 20px",
          textAlign: "center" as const,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "30px",
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
          Browse our full menu and place your order online for a delightful
          culinary experience delivered right to you.
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
          Order Online Now! 🛒
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;
