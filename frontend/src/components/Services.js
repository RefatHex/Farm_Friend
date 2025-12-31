import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';
import banner5 from '../assets/images/banner5.jpg';
import agronomist from '../assets/images/agronomistBG2.jpg';
import fertimg from '../assets/images/fertimg.jpg';
import rentIcon from '../assets/images/rentIcon.png';
import storeIcon from '../assets/images/storeIcon.png';
import expertImg from '../assets/images/expert4.jpg';
import weatherImg from '../assets/images/weatherUpdate.jpg';

const Services = () => {
  const services = [
    {
      title: 'কৃত্রিম বুদ্ধিমত্তার ফসল চাষে পরামর্শ',
      image: agronomist,
      icon: null,
      short: 'AI-ভিত্তিক ফসল নির্বাচনে সহায়তা ও পূর্বাভাস।',
      long: 'সংক্ষিপ্ত বিশ্লেষণ, মাটির ডাটা ও আবহাওয়ার উপর ভিত্তি করে সর্বোত্তম ফসল পরিকল্পনা প্রদান করা হয়।'
    },
    {
      title: 'সার প্রয়োগে কৃত্রিম বুদ্ধিমত্তার পরামর্শ',
      image: fertimg,
      icon: null,
      short: 'ব্যক্তিগতকৃত সার পরিকল্পনা আপনার ক্ষেতের জন্য।',
      long: 'নির্দিষ্ট ফসল ও মাটির ধরন অনুযায়ী সার এবং পরিমাণ নির্ধারণ করা হয় যাতে ফলন বাড়ে এবং অপচয় কমে।'
    },
    {
      title: 'কৃষি সরঞ্জাম ভাড়া',
      image: rentIcon,
      icon: rentIcon,
      short: 'সাশ্রয়ী রেট-এ আধুনিক সরঞ্জাম ভাড়া নিন।',
      long: 'ট্র্যাক্টর, হার্ভেস্টার ও অন্যান্য যন্ত্রপাতি নির্দিষ্ট সময়ের জন্য ভাড়া পাওয়া যায় — ডেলিভারি ও অপারেটর সুবিধাসহ।'
    },
    {
      title: 'কৃষি সরঞ্জাম ভাগাভাগি',
      image: storeIcon,
      icon: storeIcon,
      short: 'সহকর্মী কৃষকদের সাথে সরঞ্জাম শেয়ারিং সিস্টেম।',
      long: 'নিয়মিত ব্যবহারের জন্য ভাগাভাগি ব্যবস্থা, রিজিস্ট্রি ও রেটিং দিয়ে নির্ভরযোগ্য শেয়ারিং।'
    },
    {
      title: 'বিশেষজ্ঞ পরামর্শ',
      image: expertImg,
      icon: null,
      short: 'বিশেষজ্ঞদের থেকে ব্যক্তিগত পরামর্শ নিন।',
      long: 'অনলাইন কনসাল্টেশন কিংবা ফিল্ড ভিজিট দ্বারা রোগ, কীটনাশক ব্যবহার এবং ফসল ব্যবস্থাপনা নিয়ে বিশেষজ্ঞ পরামর্শ।'
    },
    {
      title: 'আবহাওয়ার তথ্যাদি',
      image: weatherImg,
      icon: null,
      short: 'স্থায়ী ও সময়ভিত্তিক আবহাওয়া আপডেট।',
      long: 'নিয়মিত হালনাগাদ ও ভবিষ্যদ্বাণী যাতে আপনার কৃষিকাজ সময়মতো পরিকল্পিত হয়।'
    }
  ];


  const [open, setOpen] = useState(-1);
  const navigate = useNavigate();
  const toggle = (i) => setOpen(open === i ? -1 : i);

  return (
    <section className="ftco-section ftco-intro modern-services" style={{ backgroundImage: `url(${banner5})` }}>
      <div className="overlay"></div>
      <div className="container">
        <div className="row justify-content-center pb-5 mb-3">
          <div className="col-md-8 heading-section heading-section-white text-center ftco-animate">
            <h2>আমাদের সেবাসমূহ</h2>
            <p className="lead">নিচের সেবাগুলি আপনার কাজকে সহজ, কার্যকর ও লাভজনক করতে ডিজাইন করা হয়েছে।</p>
          </div>
        </div>

        <div className="services-grid">
          {services.map((s, i) => {
            const isOpen = open === i;
            // Make only the 'কৃষি সরঞ্জাম ভাড়া' card clickable
            const isRentCard = s.title === 'কৃষি সরঞ্জাম ভাড়া';
            const handleCardClick = () => {
              if (isRentCard) {
                navigate('/equipment-list');
              }
            };
            return (
              <article
                key={i}
                className={`service-card${isOpen ? ' is-open active' : ''}${isRentCard ? ' clickable' : ''}`}
                onClick={isRentCard ? handleCardClick : undefined}
                style={isRentCard ? { cursor: 'pointer' } : {}}
              >
                <div className="card-body simple">
                  <h3 className="card-title">{s.title}</h3>
                  <p className="card-short">{s.short}</p>
                  <p className="card-long">{s.long}</p>
                  <button className="card-circle" aria-hidden="true" onClick={e => { e.stopPropagation(); toggle(i); }}>
                    <svg className="circle-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                      <path d="M8 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
