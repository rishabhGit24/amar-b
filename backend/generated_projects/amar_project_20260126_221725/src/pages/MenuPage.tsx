import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MenuSection from "../components/MenuSection";

const MenuPage: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        color: "#2d3748",
        lineHeight: "1.6",
        backgroundColor: "#f7fafc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",
          padding: "100px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
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
              color: "#2d3748",
            }}
          >
            Savor Our Exquisite Menu ✨
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              maxWidth: "800px",
              lineHeight: "1.8",
              opacity: 0.9,
              color: "#4a5568",
            }}
          >
            Explore a world of culinary delights, from our signature gourmet
            pizzas to refreshing drinks and delectable sides. Every dish crafted
            with passion, every bite a journey.
          </p>
        </div>
      </section>

      {/* Pizzas Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          marginTop: "-60px",
          position: "relative",
          zIndex: 10,
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
          Gourmet Pizzas 🍕
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          <MenuSection /> {/* Assumed to display pizza items */}
        </div>
      </section>

      {/* Sides Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "60px auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
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
          Irresistible Sides 🍟
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          <MenuSection /> {/* Assumed to display side items */}
        </div>
      </section>

      {/* Drinks Section */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "60px auto",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
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
          Refreshing Drinks 🥤
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          <MenuSection /> {/* Assumed to display drink items */}
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "100px 20px",
          textAlign: "center",
          color: "white",
          marginTop: "80px",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "30px",
            textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          Ready to Order?
        </h2>
        <p
          style={{
            fontSize: "1.6rem",
            maxWidth: "900px",
            margin: "0 auto 50px auto",
            lineHeight: "1.7",
            opacity: 0.95,
          }}
        >
          Dive into our full selection and customize your perfect meal. Fast
          delivery, fresh ingredients, unforgettable taste!
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
          Order Now!
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;
