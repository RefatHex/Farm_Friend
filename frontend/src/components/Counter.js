import React, { useEffect, useRef, useState } from 'react';
import './Counter.css';

const Counter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  const counters = [
    { target: 50, label: 'গ্রাহক' },
    { target: 8500, label: 'পেশাদার' },
    { target: 20, label: 'পণ্য' },
    { target: 50, label: 'মন্তব্য' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      counters.forEach((counter, index) => {
        let current = 0;
        const increment = counter.target / 100;
        const interval = setInterval(() => {
          current += increment;
          if (current >= counter.target) {
            current = counter.target;
            clearInterval(interval);
          }
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = Math.floor(current);
            return newCounts;
          });
        }, 20);
      });
    }
  }, [isVisible]);

  return (
    <section className="ftco-counter" id="section-counter" ref={sectionRef}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-5 mb-md-0 text-center text-md-left">
            <h2 className="font-weight-bold counter-title">আমরা কৃষিতে উদ্ভাবন যোগ করি</h2>
            <a href="/about" className="btn btn-white btn-outline-white">আমাদের সম্পর্কে</a>
          </div>
          <div className="col-md-8">
            <div className="row">
              {counters.map((counter, index) => (
                <div key={index} className="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
                  <div className="block-18 text-center">
                    <div className="text">
                      <strong className="number">{counts[index]}</strong>
                    </div>
                    <div className="text">
                      <span>{counter.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter;
