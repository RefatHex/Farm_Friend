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
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const value = window.scrollY;
      const delta = value - lastScrollY;
      const text = document.getElementById('text');
      const hill1El = document.getElementById('hill1');
      const hill4El = document.getElementById('hill4');
      const hill5El = document.getElementById('hill5');
      const leafEl = document.getElementById('leaf');

      // Animate text and background hills
      if (text) text.style.transform = `translateY(${value * 0.35}px)`;
      if (hill5El) hill5El.style.left = value * 1.5 + 'px';
      if (hill4El) hill4El.style.left = value * -1.5 + 'px';
      if (hill1El) hill1El.style.top = value * 1 + 'px';

      // Hide leaf when scrolling down; reveal when scrolled near top
      if (leafEl) {
        const hideX = (leafEl.offsetWidth || window.innerWidth) * 1.05;
        // scrolling down -> hide
        if (delta > 0) {
          leafEl.dataset.translate = hideX.toString();
          leafEl.style.transition = 'transform 400ms cubic-bezier(.2,.9,.2,1)';
          leafEl.style.transform = `translateX(${hideX}px) translateY(0px)`;
        } else {
          // scrolling up; only reveal when near top
          if (value <= 20) {
            leafEl.dataset.translate = '0';
            leafEl.style.transition = 'transform 400ms cubic-bezier(.2,.9,.2,1)';
            leafEl.style.transform = `translateX(0px) translateY(0px)`;
          }
        }
      }

      lastScrollY = value;
    };

    // Pointer-drag handlers for the leaf: drag down -> move right(hide), drag up -> come back
    let isPointerDown = false;
    let startY = 0;
    let startTranslate = 0; // px

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const onPointerDown = (e) => {
      isPointerDown = true;
      startY = e.clientY;
      const leafEl = document.getElementById('leaf');
      if (!leafEl) return;
      // parse stored translate (px) or default 0
      startTranslate = parseFloat(leafEl.dataset.translate || '0');
      // stop transition while dragging for immediate response
      leafEl.style.transition = 'none';
    };

    const onPointerMove = (e) => {
      if (!isPointerDown) return;
      const leafEl = document.getElementById('leaf');
      if (!leafEl) return;
      const deltaY = e.clientY - startY; // positive when dragging down
      const factor = 1.5; // px moved horizontally per px vertical drag
      const maxHide = (leafEl.offsetWidth || window.innerWidth) * 1.2; // hide past screen width
      let newTranslate = startTranslate + deltaY * factor;
      newTranslate = clamp(newTranslate, 0, maxHide);
      leafEl.dataset.translate = newTranslate.toString();
      // also give a subtle vertical parallax while dragging
      const extraY = Math.min(120, Math.abs(deltaY) * 0.25);
      const translateY = deltaY > 0 ? extraY : -extraY * 0.2;
      leafEl.style.transform = `translateX(${newTranslate}px) translateY(${translateY}px)`;
      // prevent page from selecting text while dragging
      e.preventDefault();
    };

    const onPointerUp = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      const leafEl = document.getElementById('leaf');
      if (!leafEl) return;
      // add smoothing transition back to nearest state
      leafEl.style.transition = 'transform 400ms cubic-bezier(.2,.9,.2,1)';
      // if leaf is mostly hidden, push it fully out; if mostly visible, snap to 0
      const cur = parseFloat(leafEl.dataset.translate || '0');
      const threshold = (leafEl.offsetWidth || window.innerWidth) * 0.35;
      const target = cur > threshold ? (leafEl.offsetWidth || window.innerWidth) * 1.1 : 0;
      leafEl.dataset.translate = target.toString();
      leafEl.style.transform = `translateX(${target}px) translateY(0px)`;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
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
        <img src={leaf} id="leaf" alt="Leaf" />
        <img src={plant} id="plant" alt="Plant" />
      </div>

      <div id="text" className="hero-text">
        <h1 className="brand">FarmFriend</h1>
        <p className="tagline">Gateway to Modern Farming</p>
        <div className="hero-cta">
          <button type="button" className="btn primary" onClick={() => { window.location.href = '/signup'; }}>Get Started</button>
          <button type="button" className="btn outline" onClick={() => { window.location.href = '/services'; }}>Learn More</button>
        </div>
      </div>

      {/* leaf and plant are now part of .parallax-background */}
    </section>
  );
};

export default ParallaxHero;
