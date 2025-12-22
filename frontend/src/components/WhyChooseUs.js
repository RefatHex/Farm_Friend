import React from 'react';
import './WhyChooseUs.css';
import expert2 from '../assets/images/expert2.jpg';
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

  return (
    <>
      <div className="blender-section">
        <h2>চলুন আমাদের সম্পর্কে জানি?</h2>
      </div>

      <div className="hero-wrap-multi" style={{ backgroundImage: `url(${banner12})` }}>
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
