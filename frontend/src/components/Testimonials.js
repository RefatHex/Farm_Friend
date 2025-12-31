import React, { useState, useEffect, useRef } from 'react';
import './Testimonials.css';
import demoVideo from '../assets/video/demo2.mp4';
import farmer1 from '../assets/images/farmer1.jpg';
import farmer2 from '../assets/images/farmer2.jpg';
import expert2 from '../assets/images/expert2.jpg';
import storageOwner from '../assets/images/storageOwner.jpg';
import farmer5 from '../assets/images/farmer5.jpg';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      image: farmer1,
      quote: 'পরামর্শক্রিত ফসল চাষের পর আমি খুবই লাভবান হয়েছি, এতে আমার উৎপাদন খরচ কমেছে এবং ফলনও বৃদ্ধি পেয়েছে।',
      name: 'রহিম চাষী',
      position: 'কৃষক',
      rating: 5
    },
    {
      image: farmer2,
      quote: 'যন্ত্রপাতি ধার করে কাজ করার ফলে খরচের পরিমাণ কমিয়ে আনা সম্ভব হয়েছে,পাশাপাশি সময়ের সাশ্রয়ও হয়েছে।',
      name: 'মিন্টু বারি',
      position: 'কৃষক',
      rating: 5
    },
    {
      image: expert2,
      quote: 'Really happy that I can help farmers by staying this far away and give them valuable advice to facilitate them.',
      name: 'Mark Huffman',
      position: 'Agronomist',
      rating: 5
    },
    {
      image: storageOwner,
      quote: 'গুদামঘর ভাড়া দিতে পারার পদ্ধতি আরো সহজ হয়েছে ও খুব সহজেই খরিদদারের সাথে যোগাযোগ সম্ভব হচ্ছে',
      name: 'Rasel Rahman',
      position: 'Businessman',
      rating: 5
    },
    {
      image: farmer5,
      quote: 'পরামর্শক্রিত সার ব্যবহার করে আমার ফসলের বাম্পার ফলন হয়েছে এবং ফসলের গুণগত মানও অনেক উন্নত হয়েছে।',
      name: 'রিপন মিয়া',
      position: 'কৃষক',
      rating: 5
    }
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % testimonials.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  return (
    <section className="ftco-section testimony-section bg-light">
      <div className="video-bg">
        <video autoPlay loop muted playsInline className="testimony-video">
          <source src={demoVideo} type="video/mp4" />
        </video>
        <div className="overlay"></div>
      </div>
      <div className="container">
        <div className="row justify-content-center pb-5">
          <div className="col-md-7 heading-section text-center ftco-animate">
            <h2>সন্তুষ্ট গ্রাহক ও তাদের সৎ প্রতিক্রিয়া</h2>
          </div>
        </div>
        <div className="row ftco-animate">
          <div className="col-md-12">
            <div className="carousel-testimony">
              <button className="carousel-btn prev" onClick={handlePrev}>
                <span className="fa fa-chevron-left">‹</span>
              </button>
              <div className="testimony-wrap d-flex transparent-grassy">
                <div 
                  className="user-img" 
                  style={{ backgroundImage: `url(${testimonials[currentIndex].image})` }}
                ></div>
                <div className="text pl-4">
                  <span className="quote d-flex align-items-center justify-content-center">
                    <i className="fa fa-quote-left">"</i>
                  </span>
                  <p className="rate">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <span key={i} className="fa fa-star">★</span>
                    ))}
                  </p>
                  <p className="quote-text">{testimonials[currentIndex].quote}</p>
                  <p className="name">{testimonials[currentIndex].name}</p>
                  <span className="position">{testimonials[currentIndex].position}</span>
                </div>
              </div>
              <button className="carousel-btn next" onClick={handleNext}>
                <span className="fa fa-chevron-right">›</span>
              </button>
            </div>
            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
