import React, { useState } from 'react';
import './Consultation.css';
import banner14 from '../assets/images/banner14.jpg';

const Consultation = () => {
  const [formData, setFormData] = useState({
    service: '',
    name: '',
    email: '',
    date: '',
    time: '',
    message: ''
  });

  const services = [
    'কৃষি সরঞ্জাম ভাড়া',
    'ফসলের গুদাম বুকিং',
    'ফসল পূর্বাভাস',
    'সার পরামর্শ',
    'আবহাওয়া আপডেট',
    'বিশেষজ্ঞ পরামর্শ'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
    alert('আপনার বার্তা সফলভাবে পাঠানো হয়েছে!');
    setFormData({
      service: '',
      name: '',
      email: '',
      date: '',
      time: '',
      message: ''
    });
  };

  return (
    <section 
      className="ftco-appointment ftco-section ftco-no-pt ftco-no-pb img"
      style={{ backgroundImage: `url(${banner14})` }}
    >
      <div className="overlay"></div>
      <div className="container">
        <div className="row d-md-flex justify-content-center">
          <div className="col-md-12 col-lg-8 half p-3 py-5 pl-lg-5 ftco-animate">
            <h2 className="mb-4">বিনামূল্যে পরামর্শ</h2>
            <form className="appointment" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <div className="form-field">
                      <div className="select-wrap">
                        <div className="icon"><span className="fa fa-chevron-down">▼</span></div>
                        <select 
                          name="service" 
                          className="form-control"
                          value={formData.service}
                          onChange={handleChange}
                          required
                        >
                          <option value="">সেবা নির্বাচন করুন</option>
                          {services.map((service, index) => (
                            <option key={index} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-wrap">
                      <div className="icon"><span className="fa fa-user">👤</span></div>
                      <input 
                        type="text" 
                        name="name"
                        className="form-control" 
                        placeholder="আপনার নাম"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-wrap">
                      <div className="icon"><span className="fa fa-paper-plane">✉</span></div>
                      <input 
                        type="email" 
                        name="email"
                        className="form-control" 
                        placeholder="ইমেইল ঠিকানা"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-wrap">
                      <div className="icon"><span className="fa fa-calendar">📅</span></div>
                      <input 
                        type="date" 
                        name="date"
                        className="form-control" 
                        placeholder="তারিখ"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-wrap">
                      <div className="icon"><span className="fa fa-clock-o">🕐</span></div>
                      <input 
                        type="time" 
                        name="time"
                        className="form-control" 
                        placeholder="সময়"
                        value={formData.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <textarea 
                      name="message" 
                      cols="30" 
                      rows="7" 
                      className="form-control" 
                      placeholder="বার্তা"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary py-3 px-4">বার্তা পাঠান</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consultation;
