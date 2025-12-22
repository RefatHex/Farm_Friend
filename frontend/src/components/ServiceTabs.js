import React, { useState } from 'react';
import './ServiceTabs.css';
import banner2 from '../assets/images/banner2.jpg';
import storage from '../assets/images/storage.jpg';
import expert1 from '../assets/images/expert1.jpg';
import cropPrediction from '../assets/images/cropPrediction.jpg';
import fertilizerPrediction from '../assets/images/fertilizerPrediction.jpeg';

const ServiceTabs = () => {
  const [activeTab, setActiveTab] = useState('services-1');

  const tabs = [
    { id: 'services-1', label: 'কৃষি সরঞ্জাম ভাড়া' },
    { id: 'services-2', label: 'গুদামঘর ভাড়া' },
    { id: 'services-3', label: 'বিষেশজ্ঞ পরামর্শ' },
    { id: 'services-4', label: 'ফসল চাষের পূর্বাভাস' },
    { id: 'services-5', label: 'সার প্রয়োগে পরামর্শ' }
  ];

  const tabContent = {
    'services-1': {
      image: banner2,
      title: 'কৃষি সরঞ্জাম ভাড়া',
      description: 'কৃষকরা নির্দিষ্ট সময়ের জন্য প্রয়োজনীয় সরঞ্জাম ভাড়া নিতে পারেন। সরঞ্জাম মালিকরা তাদের অতিরিক্ত সরঞ্জাম ভাড়া দিয়ে কিছু আয় করতে পারেন।'
    },
    'services-2': {
      image: storage,
      title: 'গুদাম ভাড়া',
      description: 'কৃষকরা নির্দিষ্ট সময়ের জন্য তাদের ফসল সংরক্ষণ করতে গুদাম বুক করতে পারেন। গুদাম মালিকরা তাদের গুদামের তথ্য শেয়ার করে আয় করতে পারেন।'
    },
    'services-3': {
      image: expert1,
      title: 'বিশেষজ্ঞ পরামর্শ',
      description: 'কৃষকরা তাদের সমস্যার সমাধানের জন্য কৃষি বিশেষজ্ঞদের সাথে পরামর্শ করতে পারেন। কৃষি বিজ্ঞানীরা অতিরিক্ত সময় অনলাইনে দিয়ে অতিরিক্ত আয় করতে পারেন।'
    },
    'services-4': {
      image: cropPrediction,
      title: 'ফসল চাষে পূর্বাভাস',
      description: 'কৃষকরা জানতে পারেন তাদের জমির জন্য কোন ধরনের ফসল সবচেয়ে উপযোগী। কিছু তথ্য প্রদান করুন এবং পূর্বাভাস নিন।'
    },
    'services-5': {
      image: fertilizerPrediction,
      title: 'সার প্রয়োগে পরামর্শ',
      description: 'কৃষকরা বিশেষজ্ঞ পরামর্শ ছাড়াই কোন সার ব্যবহার করবেন তা জানতে পারেন। সর্বাধিক ফলাফল পেতে সামান্য তথ্য দিন এবং পূর্বাভাস নিন।'
    }
  };

  return (
    <section className="ftco-section service-tabs-section">
      <div className="container">
        <div className="row justify-content-center pb-5">
          <div className="col-md-7 heading-section text-center ftco-animate">
            <h2>পূর্ব ও পরবর্তী সেবা</h2>
          </div>
        </div>
        <div className="row tabulation mt-4 ftco-animate">
          <div className="col-md-4 order-md-last">
            <ul className="nav nav-pills nav-fill d-md-flex d-block flex-column">
              {tabs.map(tab => (
                <li key={tab.id} className="nav-item text-left">
                  <button
                    className={`nav-link py-4 ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-8">
            <div className="tab-content">
              <div className="tab-pane container p-0 active">
                <div 
                  className="img" 
                  style={{ backgroundImage: `url(${tabContent[activeTab].image})` }}
                ></div>
                <h3><a href="/login">{tabContent[activeTab].title}</a></h3>
                <p>{tabContent[activeTab].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTabs;
