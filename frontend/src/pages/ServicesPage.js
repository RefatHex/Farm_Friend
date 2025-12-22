import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ServicesPage.css';
import a6 from '../assets/images/a6.jpg';
import a1 from '../assets/images/a1.jpg';
import a8 from '../assets/images/a8.png';

const ServicesPage = () => {
  const services = [
    {
      icon: '🚜',
      title: 'কৃষি পণ্য',
      description: 'গুণমানসম্পন্ন কৃষি পণ্য এবং যন্ত্রপাতি সংগ্রহ করুন'
    },
    {
      icon: '🌱',
      title: 'বিশেষজ্ঞ পরামর্শ',
      description: 'কৃষি বিশেষজ্ঞদের কাছ থেকে পরামর্শ নিন'
    },
    {
      icon: '🎧',
      title: 'চমৎকার সেবা',
      description: 'আপনার সকল প্রয়োজনের জন্য ২৪/৭ গ্রাহক সহায়তা'
    },
    {
      icon: '👥',
      title: 'কমিউনিটি তৈরি',
      description: 'বাংলাদেশের কৃষকদের সাথে সংযোগ স্থাপন করুন'
    }
  ];

  const features = [
    {
      icon: '🚜',
      title: 'কৃষিতে উদ্ভাবন',
      description: 'প্রযুক্তি এবং কৃষিকে একত্রিত করে কৃষিতে নতুন একটি মাত্রা যোগ করা হচ্ছে।'
    },
    {
      icon: '🥕',
      title: 'যন্ত্রপাতি শেয়ারিং',
      description: 'যন্ত্রপাতি কিনতে বা ভাড়া নিতে পারেন, যা খরচ কমাতে সাহায্য করে।'
    },
    {
      icon: '💡',
      title: 'বিশেষজ্ঞ পরামর্শ',
      description: 'কৃষি বিশেষজ্ঞদের কাছ থেকে পরামর্শ নেওয়া যায়। এই পরামর্শগুলি ভাল ফলাফল অর্জনে সহায়ক হতে পারে।'
    }
  ];

  return (
    <div className="services-page">
      <Navbar />
      
      {/* Inner Banner */}
      <div className="inner-banner py-5">
        <section className="A-breadcrumb text-left py-sm-5">
          <div className="container">
            <div className="w3breadcrumb-gids">
              <div className="w3breadcrumb-left text-left">
                <h2 className="inner-w3-title">সেবাসমূহ</h2>
                <p className="inner-page-para mt-2">Gateway to Modern Farming</p>
              </div>
              <div className="w3breadcrumb-right">
                <ul className="breadcrumbs-custom-path">
                  <li><a href="/">হোম</a></li>
                  <li className="active">
                    <span className="mx-2">→</span> সেবা
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* What We Offer Section */}
      <section className="A-circles py-5" id="services-section">
        <div className="container py-md-5 py-2">
          <div className="row A-circles-row">
            <div className="col-lg-6 circles-left">
              <img src={a6} alt="Services" className="radius-image img-fluid" />
            </div>
            <div className="col-lg-6 circles-right mt-lg-0 mt-5 align-self position-relative">
              <h6 className="title-subw3hny">আমাদের সেবাসমূহ</h6>
              <h3 className="title-A mb-4">
                বিশেষজ্ঞ পরামর্শ প্রদান, <br />যন্ত্রপাতি ভাড়া এবং স্টোরেজ পরিষেবা
              </h3>
              <p style={{ textAlign: 'justify' }}>
                কৃষকদের উপযুক্ত পরামর্শ প্রদান করুন যেমন ফসল নির্বাচন, মাটি ব্যবস্থাপনা, এবং আধুনিক কৃষি কৌশল। 
                একটি সাশ্রয়ী এবং শেয়ার্ড অর্থনীতির মডেল মাধ্যমে কৃষকদের প্রয়োজনীয় কৃষি যন্ত্রপাতি এবং মেশিনারি সহজে ব্যবহারযোগ্য করে তুলুন। 
                কৃষকদের সরাসরি স্টোরেজ সুবিধার সাথে যুক্ত করুন যাতে তারা তাদের ফলন সংরক্ষণ করতে পারে এবং পরবর্তী ফলন হারানোর পরিমাণ কমাতে পারে।
              </p>
              <div className="w3banner-content-btns">
                <a href="/about" className="btn btn-style btn-primary mt-lg-5 mt-4 me-2">
                  আরও পড়ুন → 
                </a>
                <a href="/contact" className="btn btn-style btn-outline-dark mt-lg-5 mt-4">
                  আমাদের সাথে যোগাযোগ করুন → 
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="A-content-4 py-5" id="features">
        <div className="content-4-main py-lg-5 py-md-4 py-2">
          <div className="container">
            <div className="content-info-in row align-items-center">
              <div className="content-left col-lg-6 pe-lg-5">
                {features.map((feature, index) => (
                  <div key={index} className="row content4-right-grids mb-sm-5 mb-4 pb-3">
                    <div className="col-2 content4-right-icon">
                      <div className="content4-icon">
                        <span>{feature.icon}</span>
                      </div>
                    </div>
                    <div className="col-10 content4-right-info ps-lg-5">
                      <h6><a href="#">{feature.title}</a></h6>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="HomeAboutImages col-lg-6 mt-lg-0 mt-md-5 mt-4">
                <div className="row position-relative">
                  <div className="col-6">
                    <img src={a1} alt="Agriculture" className="radius-image img-fluid" />
                  </div>
                  <div className="col-6 mt-4">
                    <img src={a8} alt="Agriculture" className="radius-image img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="A-index5 py-5" id="about">
        <div className="new-block py-md-5 py-3">
          <div className="container">
            <div className="row middle-section align-self">
              <div className="col-lg-6 video-info pe-lg-5">
                <div className="title-content text-left">
                  <h6 className="title-subw3hny-light">প্রকৃতির সাথে শিকড়</h6>
                  <h3 className="title-A-light two pe-lg-5">দৃঢ় অর্থনীতি গড়তে কৃষি উন্নয়ন করুন</h3>
                  <a href="/contact" className="btn btn-style btn-outline-light mt-sm-5 mt-4">
                    এখনই যোগাযোগ করুন
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="A-features-4">
        <div className="features4-block py-5">
          <div className="container py-md-5">
            <div className="we-header text-center">
              <h6 className="title-subw3hny">আমাদের সেবা</h6>
              <h3 className="title-A mb-5">আমরা কি করছি</h3>
            </div>
            <div className="row features4-grids text-center align-items-center">
              {services.map((service, index) => (
                <div key={index} className="col-lg-3 col-md-6">
                  <div className="features4-grid">
                    <div className="feature-images">
                      <span>{service.icon}</span>
                    </div>
                    <h5><a href="#">{service.title}</a></h5>
                    <p>{service.description}</p>
                    <a href="/about" className="grid-link">
                      আরও পড়ুন <span>→</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};


export default ServicesPage;
