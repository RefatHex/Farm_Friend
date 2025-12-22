import React from 'react';
import './Gallery.css';
import banner2 from '../assets/images/banner2.jpg';
import storage from '../assets/images/storage.jpg';
import expert1 from '../assets/images/expert1.jpg';
import cropPrediction from '../assets/images/cropPrediction.jpg';
import fertilizerPrediction from '../assets/images/fertilizerPrediction.jpeg';
import weatherUpdate from '../assets/images/weatherUpdate.jpg';

const Gallery = () => {
  const galleryItems = [
    {
      image: banner2,
      title: 'ব্যবহারকারীরা কম টাকায় সরঞ্জাম ভাড়া নিতে পারে',
      category: 'সরঞ্জাম ভাড়া'
    },
    {
      image: storage,
      title: 'ফসল সংরক্ষণ করতে গুদাম বুক করুন',
      category: 'গুদাম ভাড়া'
    },
    {
      image: expert1,
      title: 'অভিজ্ঞ কৃষিবিদদের কাছ থেকে বিশেষজ্ঞ পরামর্শ নিন',
      category: 'পরামর্শ'
    },
    {
      image: cropPrediction,
      title: 'প্রয়োজনীয় ফসল পূর্বাভাস পেতে এখানে ক্লিক করুন',
      category: 'ফসল পূর্বাভাস'
    },
    {
      image: fertilizerPrediction,
      title: 'মাটির পরীক্ষার উপর ভিত্তি করে সার পরামর্শ',
      category: 'সার সুপারিশ'
    },
    {
      image: weatherUpdate,
      title: 'আবহাওয়া আপডেট এবং সতর্কতা পেতে এখানে ক্লিক করুন',
      category: 'আবহাওয়া আপডেট'
    }
  ];

  return (
    <section className="ftco-section gallery-section">
      <div className="container-fluid px-md-4">
        <div className="col-md-7 heading-section text-center ftco-animate" style={{ margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center' }}>গ্যালারি ও ছবি</h2>
        </div>
        <br />
        <div className="row">
          {galleryItems.map((item, index) => (
            <div key={index} className="col-md-4">
              <div 
                className="work mb-4 img d-flex align-items-end" 
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <a 
                  href={item.image} 
                  className="icon image-popup d-flex justify-content-center align-items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="fa fa-expand">⤢</span>
                </a>
                <div className="desc w-100 px-4">
                  <div className="text w-100 mb-3">
                    <span>{item.category}</span>
                    <h2><a href="/login">{item.title}</a></h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
