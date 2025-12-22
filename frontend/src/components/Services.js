import React from 'react';
import './Services.css';
import banner13 from '../assets/images/banner13.jpg';

const Services = () => {
  const services = [
    {
      title: 'কৃত্রিম বুদ্ধিমত্তার ফসল চাষে পরামর্শ',
      description: 'কৃত্রিম বুদ্ধিমত্তার ব্যবহার করে সঠিক ফসল পূর্বাভাস পান, যা আপনার ফসলের পরিকল্পনাকে আরও কার্যকর করে তুলবে।'
    },
    {
      title: 'সার প্রয়োগে কৃত্রিম বুদ্ধিমত্তার পরামর্শ',
      description: 'কৃত্রিম বুদ্ধিমত্তা দ্বারা ব্যক্তিগতকৃত সার পরামর্শ পান যা ফসলের উৎপাদন বাড়ায় এবং খরচ ও পরিবেশের প্রভাব কমায়।'
    },
    {
      title: 'কৃষি সরঞ্জাম ভাড়া',
      description: 'উন্নত প্রযুক্তি সকলের জন্য সাশ্রয়ী করতে বিভিন্ন কৃষি সরঞ্জাম ও যন্ত্রপাতি ভাড়া নিন।'
    },
    {
      title: 'কৃষি সরঞ্জাম ভাগাভাগি',
      description: 'সম্পদ ব্যবহারের সর্বোচ্চ সুবিধা পেতে অন্যান্য কৃষকদের সাথে সরঞ্জাম শেয়ার করুন বা লিজ দিন।'
    },
    {
      title: 'বিশেষজ্ঞ পরামর্শ',
      description: 'আপনার কৃষি সমস্যা সমাধানে বিশেষজ্ঞদের পরামর্শ নিন।'
    },
    {
      title: 'আবহাওয়ার তথ্যাদি',
      description: 'পরিবর্তনশীল আবহাওয়া পরিস্থিতি সম্পর্কে সময়মতো খবর পান, যা আপনার কৃষি কাজকে আরও কার্যকর করবে।'
    }
  ];

  return (
    <section className="ftco-section ftco-intro" style={{ backgroundImage: `url(${banner13})` }}>
      <div className="overlay"></div>
      <div className="container">
        <div className="row justify-content-center pb-5 mb-3">
          <div className="col-md-7 heading-section heading-section-white text-center ftco-animate">
            <h2>আমাদের সেবাসমূহ</h2>
          </div>
        </div>
        <div className="row">
          {services.map((service, index) => (
            <div key={index} className="col-md-4 d-flex align-self-stretch ftco-animate">
              <div className="d-block services">
                <div className="media-body">
                  <h3 className="heading">{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="/login" className="btn-custom d-flex align-items-center justify-content-center">
                    <span className="fa fa-chevron-right"></span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
