import React, { useState, useEffect, useRef } from 'react';
import './WhyChooseUs.css';
import expert1 from '../assets/images/expert1.jpg';
import expert2 from '../assets/images/expert2.jpg';
import expert3 from '../assets/images/expert3.jpg';
import banner12 from '../assets/images/banner12.png';

const WhyChooseUs = () => {
  const features = [
    {
      title: '২৪/৭ সেবা',
      description: 'আমরা নিশ্চিত করি যে কৃষকরা আমাদের প্ল্যাটফর্ম যেকোনো সময় ব্যবহার করতে পারে, গুদাম সুবিধা, বিশেষজ্ঞ পরামর্শ এবং আরও অনেক কিছুতে সার্বক্ষণিক সহায়তা প্রদান করে।'
    },
    {
      title: 'পেশাদার ও অভিজ্ঞ কর্মী',
      description: 'কৃষি ও প্রযুক্তিতে দক্ষ একটি উৎসাহী দলের দ্বারা তৈরি যারা কৃষকদের প্রয়োজন অনুযায়ী উদ্ভাবনী সমাধান প্রদান করে।'
    },
    {
      title: 'উচ্চ মানের ও নির্ভরযোগ্য সেবা',
      description: 'সার প্রয়োগে পরামর্শ এবং বিশেষজ্ঞ পরামর্শের মতো উন্নত বৈশিষ্ট্য সরবরাহ করে।'
    },
    {
      title: 'গ্রাহক সেবা ও বিশেষজ্ঞ পরামর্শ',
      description: 'ব্যক্তিগত পরামর্শ এবং ব্যবহারকারী-বান্ধব ইন্টারফেস থেকে কৃষকরা উপকৃত হতে পারেন।'
    }
  ];

  const collageRef = useRef(null);
  const [tiles, setTiles] = useState([
    { r: -4, l: '4%', t: '6%', w: '62%', h: '62%' },
    { r: 6, rPos: '2%', t: '26%', w: '58%', h: '58%' },
    { r: -8, l: '14%', b: '6%', w: '48%', h: '48%' }
  ]);

  useEffect(() => {
    // randomize slight rotations and positions once on mount and on resize (debounced)
    let timer = null;
    const applyRandom = () => {
      const width = collageRef.current ? collageRef.current.offsetWidth : 420;
      const scale = Math.max(0.75, Math.min(1, width / 420));
      const next = [
        {
          r: -6 + Math.round(Math.random() * 6),
          l: `${4 * scale}%`,
          t: `${6 * scale}%`,
          w: `${62 * scale}%`,
          h: `${62 * scale}%`
        },
        {
          r: 4 + Math.round(Math.random() * 6),
          rPos: `${2 * scale}%`,
          t: `${22 * scale}%`,
          w: `${58 * scale}%`,
          h: `${58 * scale}%`
        },
        {
          r: -10 + Math.round(Math.random() * 6),
          l: `${12 * scale}%`,
          b: `${6 * scale}%`,
          w: `${48 * scale}%`,
          h: `${48 * scale}%`
        }
      ];
      setTiles(next);
    };

    applyRandom();
    const onResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        applyRandom();
      }, 180);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="blender-section">
        <h2>চলুন আমাদের সম্পর্কে জানি?</h2>
      </div>

      <div className="hero-wrap-multi" style={{ backgroundImage: `url(${banner12})` }}>
        <div className="left-decor" aria-hidden="true">
          <div className="collage" ref={collageRef}>
            <div
              className="tile tile-1"
              style={{
                backgroundImage: `url(${expert2})`,
                transform: `rotate(${tiles[0].r}deg)`,
                left: tiles[0].l,
                top: tiles[0].t,
                width: tiles[0].w,
                height: tiles[0].h
              }}
            />
            <div
              className="tile tile-2"
              style={{
                backgroundImage: `url(${expert3})`,
                backgroundPosition: 'center right',
                transform: `rotate(${tiles[1].r}deg)`,
                right: tiles[1].rPos,
                top: tiles[1].t,
                width: tiles[1].w,
                height: tiles[1].h
              }}
            />
            <div
              className="tile tile-3"
              style={{
                backgroundImage: `url(${expert1})`,
                backgroundPosition: 'center left',
                transform: `rotate(${tiles[2].r}deg)`,
                left: tiles[2].l,
                bottom: tiles[2].b,
                width: tiles[2].w,
                height: tiles[2].h
              }}
            />
          </div>
        </div>
        <section className="ftco-section ftco-no-pt ftco-no-pb">
          <div className="container">
            <div className="row d-flex no-gutters">
              <div className="col-md-5 d-flex">
                <div
                  className="img img-video d-flex align-self-stretch align-items-center justify-content-center justify-content-md-center mb-4 mb-sm-0"
                  style={{ backgroundImage: `url(${expert2})` }}
                >
                </div>
              </div>
              <div className="col-md-7 pl-md-5 py-md-5">
                <div className="heading-section pt-md-5">
                  <h2 className="mb-4 white-text">কেন আমাদের বেছে নেবেন?</h2>
                </div>
                <div className="row">
                  {features.map((feature, index) => (
                    <div key={index} className="col-md-6 services-2 w-100 d-flex">
                      <div className="text pl-3">
                        <h4>{feature.title}</h4>
                        <p className="dark-text">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default WhyChooseUs;
