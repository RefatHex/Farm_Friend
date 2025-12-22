import React from 'react';
import './About.css';
import banner1 from '../assets/images/banner1.jpg';

const About = () => {
  const features = [
    'ক্ষেতের উপযোগী ফসলের সুপারিশ এবং সার পরামর্শ পান',
    'সরঞ্জাম ভাড়া নিন বা সরঞ্জাম ভাড়া দিয়ে আয় করুন',
    'ফসল সংরক্ষণের জন্য গুদাম বুক করুন বা সহজে গুদাম ভাড়া নিন',
    'অবস্থানের ভিত্তিতে আবহাওয়ার আপডেট এবং সতর্কতা পান'
  ];

  return (
    <section id="about-3" className="about-3 section">
      <div className="container">
        <div className="row gy-4 justify-content-between align-items-center">
          <div className="col-lg-6 order-lg-2 position-relative" data-aos="zoom-out">
            <img src={banner1} alt="কৃষি উদ্ভাবনের প্রদর্শনী ব্যানার" className="img-fluid" />
            <a href="/assets/video/demo.mp4" className="pulsating-play-btn" aria-label="ডেমো ভিডিও চালান">
              <span className="play">▶</span>
            </a>
          </div>
          <div className="col-lg-5 order-lg-1" data-aos="fade-up" data-aos-delay="100">
            <h2 className="content-title mb-4">কৃষিতে উদ্ভাবন</h2>
            <p className="mb-4">
              ফার্ম-ফ্রেন্ড অতীতের তথ্য এবং কৃষি কৌশল অনুযায়ী ফসলের সুপারিশ প্রদান করে।
              এটি তাৎক্ষনিক আবহাওয়ার সতর্কতা পাঠায় যা কৃষকদের তাদের কার্যক্রম পরিকল্পনা করতে এবং ক্ষতি এড়াতে সহায়তা করে।
              কৃষকরা আমাদের প্ল্যাটফর্ম ব্যবহার করে কৃষি সরঞ্জাম ভাড়া বা শেয়ার করতে পারেন, যা অর্থ এবং সম্পদ বাঁচায়।
            </p>
            <p className="mb-4">
              সিস্টেমটি মাটি পরীক্ষার উপর ভিত্তি করে সার সুপারিশ প্রদান করে, যা নিশ্চিত করে যে ফসলগুলি প্রয়োজনীয় পুষ্টি পাচ্ছে।
              এটি আপডেটেড বাজার মূল্য সরবরাহ করার পাশাপাশি কৃষকদের মধ্যে যোগাযোগ ও ফসল বিক্রয়ের সেরা মূল্য পেতে সংযোগ স্থাপন করে।
              এছাড়াও, এটি সরাসরি কৃষকদের গুদামের মালিকদের সাথে সংযুক্ত করে, মধ্যস্বত্বভোগী ছাড়াই ফসল সংরক্ষণ এবং বিক্রির প্রক্রিয়াকে সহজ করে তোলে।
            </p>
            <ul className="list-unstyled list-check">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <p>
              <a href="/login" className="btn-cta" aria-label="ফার্ম-ফ্রেন্ডের সাথে যোগাযোগ করুন">যোগ দিন</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
