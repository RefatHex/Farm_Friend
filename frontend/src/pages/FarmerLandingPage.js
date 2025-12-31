import React from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerNavbar from '../components/FarmerNavbar';
import Footer from '../components/Footer';
import './FarmerLandingPage.css';

const FarmerLandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: 'ফসল চাষ পরামর্শ',
      description: 'মাটির এবং আবহাওয়া পরিস্থিতির উপর ভিত্তি করে শ্রেষ্ঠ ফসলের সঠিক পূর্বাভাস পান।',
      buttonText: 'আরও জানুন',
      link: '/crop-advice'
    },
    {
      id: 2,
      title: 'সারের সুপারিশ',
      description: 'আপনার ফসলের জন্য সেরা সারগুলো পেতে সঠিক সুপারিশ নিন।',
      buttonText: 'চেক করুন',
      link: '/fertilizer'
    },
    {
      id: 3,
      title: 'গুদাম ভাড়া',
      description: 'আপনার পণ্যের জন্য গুদাম সুবিধা খুঁজে পেতে এবং বুক করতে সহায়ক।',
      buttonText: 'চুক্তি দেখুন',
      link: '/storage'
    },
    {
      id: 4,
      title: 'কৃষি সরঞ্জাম ভাড়া',
      description: 'খরচ বাঁচাতে এবং দক্ষতা বাড়াতে কৃষি যন্ত্রপাতি এবং সরঞ্জাম ভাড়া নিন।',
      buttonText: 'এখন ভাড়া করুন',
      link: '/equipment-list'
    },
    {
      id: 5,
      title: 'বিশেষজ্ঞ পরামর্শ',
      description: 'ব্যক্তিগত কৃষি পরামর্শের জন্য কৃষি বিশেষজ্ঞদের সাথে যোগাযোগ করুন।',
      buttonText: 'পরামর্শ নিন',
      link: '/experts'
    },
    {
      id: 6,
      title: 'আবহাওয়া সতর্কতা',
      description: 'বাস্তব সময়ের আবহাওয়া সতর্কতার মাধ্যমে আপনার কৃষি কার্যক্রম দক্ষতার সাথে পরিকল্পনা করুন।',
      buttonText: 'আবহাওয়া চেক করুন',
      link: '/weather'
    },
    {
      id: 7,
      title: 'আমার লেনদেন সমূহ',
      description: 'আপনার সক্রিয় এবং পূর্ববর্তী সমস্ত চুক্তি FarmFriend-এর সাথে দেখুন এবং পরিচালনা করুন।',
      buttonText: 'চেক করুন',
      link: '/my-bookings'
    }
  ];

  const handleFeatureClick = (feature) => {
    navigate(feature.link);
  };

  return (
    <div className="farmer-landing-page">
      <FarmerNavbar />
      
      <div className="farmer-background">
        <div className="farmer-container">
          <h2>স্বাগতম, কৃষক!</h2>
          <p>
            আপনার কৃষি যাত্রাকে সহজ এবং আরও উৎপাদনশীল করার জন্য আমরা যে সেবা প্রদান
            করি তা এক্সপ্লোর করুন।
          </p>
          
          <div className="features">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className="feature-card"
              >
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button onClick={() => handleFeatureClick(feature)}>
                  {feature.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FarmerLandingPage;
