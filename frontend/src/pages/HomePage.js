import React from 'react';
import Navbar from '../components/Navbar';
import ParallaxHero from '../components/ParallaxHero';
import WhyChooseUs from '../components/WhyChooseUs';
import Counter from '../components/Counter';
import Services from '../components/Services';
import ServiceTabs from '../components/ServiceTabs';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Blog from '../components/Blog';
import Consultation from '../components/Consultation';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <ParallaxHero />
      <WhyChooseUs />
      <div style={{ marginTop: '40px' }}></div>
      <Counter />
      <Services />
      <ServiceTabs />
      <Testimonials />
      <About />
      <Gallery />
      <Blog />
      <Consultation />
      <Footer />
    </div>
  );
};

export default HomePage;
