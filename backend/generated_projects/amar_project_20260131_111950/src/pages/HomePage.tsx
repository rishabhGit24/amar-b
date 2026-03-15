import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import MenuSection from '../components/MenuSection';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      color: '#2d3748',
      lineHeight: '1.7',
      backgroundColor: '#fdfcfb',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      scrollBehavior: 'smooth',
    }}>
      <Header />
      <main style={{ flexGrow: 1 }}>
        {/*
          The following components are assumed to be self-contained and
          already implement the beautiful, production-ready styles and
          engaging content as per the overall system guidelines.
          They are used without props as per the component usage guidelines.
        */}
        <Hero />
        <AboutSection />
        <MenuSection />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;