import React, { useEffect, useRef } from 'react';
import './ParallaxHero.css';
import hill1 from '../assets/images/parallax/hill1.png';
import hill2 from '../assets/images/parallax/hill2.png';
import hill3 from '../assets/images/parallax/hill3.png';
import hill4 from '../assets/images/parallax/hill4.png';
import hill5 from '../assets/images/parallax/hill5.png';
import tree from '../assets/images/parallax/tree.png';
import leaf from '../assets/images/parallax/leaf.png';
import plant from '../assets/images/parallax/plant.png';

const ParallaxHero = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const value = window.scrollY;
      const text = document.getElementById('text');
      const leafEl = document.getElementById('leaf');
      const hill1El = document.getElementById('hill1');
      const hill4El = document.getElementById('hill4');
      const hill5El = document.getElementById('hill5');

      if (text) text.style.marginTop = value * 2.5 + 'px';
      if (leafEl) leafEl.style.top = value * -1.5 + 'px';
      if (leafEl) leafEl.style.left = value * 1.5 + 'px';
      if (hill5El) hill5El.style.left = value * 1.5 + 'px';
      if (hill4El) hill4El.style.left = value * -1.5 + 'px';
      if (hill1El) hill1El.style.top = value * 1 + 'px';
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="parallax" ref={parallaxRef}>
      <div className="parallax-background">
        <img src={hill1} id="hill1" alt="Hill 1" />
        <img src={hill2} id="hill2" alt="Hill 2" />
        <img src={hill3} id="hill3" alt="Hill 3" />
        <img src={hill4} id="hill4" alt="Hill 4" />
        <img src={hill5} id="hill5" alt="Hill 5" />
        <img src={tree} id="tree" alt="Tree" />
      </div>

      <h2 id="text">
        <div className="intro-text">
          <h1>FarmFriend<br /></h1>
          <h1>Gateway to Modern Farming</h1>
        </div>
      </h2>

      <img src={leaf} id="leaf" alt="Leaf" />
      <img src={plant} id="plant" alt="Plant" />
    </section>
  );
};

export default ParallaxHero;
