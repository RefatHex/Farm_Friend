import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AboutPage.css';
import banner2 from '../assets/images/banner2.jpg';
import team5 from '../assets/images/team5.jpg';
import team3 from '../assets/images/team3.jpg';
import team2 from '../assets/images/team2.jpg';

const AboutPage = () => {
  return (
    <div className="about-page">
      <Navbar />
      
      {/* Inner Banner */}
      <div className="inner-banner py-5">
        <section className="A-breadcrumb text-left py-sm-5">
          <div className="container">
            <div className="w3breadcrumb-gids">
              <div className="w3breadcrumb-left text-left">
                <h2 className="inner-w3-title">আমাদের সম্পর্কে</h2>
                <p className="inner-page-para mt-2">
                  উন্নত কৃষি উন্নত ভবিষ্যতের জন্য
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* About Section */}
      <section className="A-banner-agency py-5" id="work">
        <div className="midd-w3 py-md-4">
          <div className="container">
            <div className="about-img-top mb-lg-5 mb-4">
              <img src={banner2} alt="Agriculture Banner" className="img-fluid radius-image" />
            </div>
            <div className="row">
              <div className="col-lg-6 banner-content align-self">
                <h6 className="title-subw3hny">আমাদের সম্পর্কে</h6>
                <h3 className="title-A">কৃষি ও ফার্ম-ফ্রেন্ড</h3>
                <div className="w3banner-content-btns">
                  <a href="/about" className="btn btn-style btn-primary mt-lg-5 mt-4 me-2">
                    আরও পড়ুন <i className="fas fa-arrow-right ms-2"></i>
                  </a>
                  <a href="/contact" className="btn btn-style btn-outline-dark mt-lg-5 mt-4">
                    যোগাযোগ করুন <i className="fas fa-arrow-right ms-2"></i>
                  </a>
                </div>
              </div>
              <div className="col-lg-6 text-left ps-lg-5 mt-lg-0 mt-md-5 mt-4">
                <p style={{ textAlign: 'justify' }}>
                  ফার্ম-ফ্রেন্ড শুধুমাত্র একটি টুল নয়— এটি কৃষিকে আরও স্মার্ট এবং টেকসই করার একটি উপায়।
                  আধুনিক কৃষির পদ্ধতিগুলি প্রচার করে এবং অপচয় কমিয়ে, এটি কৃষকদের জীবন উন্নত করতে সাহায্য করে এবং
                  সাসটেইনেবল ডেভেলপমেন্ট গোলস (SDGs) যেমন শূন্য ক্ষুধা এবং ন্যায়সঙ্গত কাজ এবং অর্থনৈতিক প্রবৃদ্ধি সমর্থন করে।
                  সহজ এবং ব্যবহারকারী-বান্ধব বৈশিষ্ট্যগুলি সহ, ফার্ম-ফ্রেন্ড কৃষকদের জন্য অবিশ্বাস্য উপকার এনে দিতে ডিজাইন করা হয়েছে,
                  তাদের আরও ফলন দিতে, বেশি উপার্জন করতে এবং একটি ভাল, সমৃদ্ধ জীবনযাপন করতে সহায়তা করে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="A-blog-se-3 py-5" id="ab-grids">
        <div className="container">
          <div className="inner-sec-As py-lg-5 py-md-4 py-2">
            <div className="row blog-sec">
              <div className="col-lg-4 manager-img mb-lg-0 mb-md-5 mb-4 pe-lg-5">
                <h6 className="title-subw3hny">কেন আমাদের নির্বাচন করবেন</h6>
                <h3 className="title-A">কৃষিতে উদ্ভাবন যোগ করা</h3>
                <p className="card-text mt-3">
                  এই আধুনিক যুগে, আমরা কৃষির ক্ষেত্রে প্রযুক্তি এমনভাবে যুক্ত করেছি
                  যা প্রচেষ্টার পরিমাণ কমায় এবং লাভের পরিমাণ বাড়ায়।
                </p>
                <a href="tel:+00-123-456-78" className="btn btn-style btn-primary mt-lg-5 mt-4">
                  <span className="fas fa-phone-alt" aria-hidden="true"></span> +00-123-456-78
                </a>
              </div>
              <div className="col-lg-4 col-md-6 about-in blog-grid-info text-left">
                <div className="card img">
                  <div className="card-body img">
                    <div className="blog-des mt-4">
                      <h5 className="card-title mt-4">আমাদের উদ্দেশ্য</h5>
                      <p className="card-text" style={{ textAlign: 'justify' }}>
                        বাংলাদেশের কৃষকদের উদ্ভাবনী, প্রবেশযোগ্য এবং টেকসই সমাধান দিয়ে ক্ষমতায়ন করা,
                        তাদের তথ্যভিত্তিক সিদ্ধান্ত নিতে সক্ষম করা, উৎপাদনশীলতা বৃদ্ধি করা এবং খরচ কমানো।
                        ফার্ম-ফ্রেন্ড কৃষকদের জীবনমান উন্নত করতে সাহায্য করে
                        বাস্তব সময়ের সরঞ্জাম, ডেটা-চালিত অন্তর্দৃষ্টি প্রদান করে এবং
                        কৃষি সম্প্রদায়ের মধ্যে সংযোগ তৈরি করে।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 about-in blog-grid-info text-left mt-md-0 mt-5">
                <div className="card img">
                  <div className="card-body img">
                    <div className="blog-des mt-3">
                      <h5 className="card-title mt-4">আমাদের কল্পনা</h5>
                      <p className="card-text">
                        বাংলাদেশে কৃষি বিপ্লব ঘটিয়ে অর্থনৈতিক প্রবৃদ্ধি এবং টেকসইতা অর্জন করার জন্য আমরা প্রথমস্থানী প্ল্যাটফর্ম হতে চাই।
                        আমাদের লক্ষ্য সমৃদ্ধ কৃষি পরিবেশ তৈরি করা যেখানে কৃষকরা সঠিক সরঞ্জাম ও জ্ঞান দ্বারা সজ্জিত হয়ে চ্যালেঞ্জগুলো মোকাবেলা করতে পারে।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="A-team py-5" id="A-team">
        <div className="container py-md-5">
          <div className="row text-left">
            <div className="col-md-6 mt-md-5 pe-lg-5">
              <div className="title-content text-left">
                <h6 className="title-subw3hny">আমাদের টিম</h6>
                <h3 className="title-A mb-3">টিম ফার্ম-ফ্রেন্ড</h3>
                <p style={{ textAlign: 'justify' }}>
                  আমরা ৩ জন চেয়েছিলাম একটি প্ল্যাটফর্ম তৈরি করতে যা কৃষকদের সাহায্য করবে
                  প্রযুক্তির সাথে পরিচিত হতে এবং কৃষিতে উদ্ভাবন যোগ করবে। মাসব্যাপী গবেষণা এবং আপনার সমর্থনের মাধ্যমে,
                  আমরা এই সাফল্য অর্জন করতে সক্ষম হয়েছি।
                </p>
                <a className="btn btn-style btn-primary mt-md-5 mt-4" href="#">
                  আমাদের টিমে যোগ দিন <span className="fas fa-arrow-right ms-2"></span>
                </a>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12 text-center">
                  <div className="team-grids">
                    <img src={team5} className="img-fluid mb-3" alt="Team Member" style={{ width: '200px', height: 'auto' }} />
                    <h4>Iftekharul Islam Refat</h4>
                    <h6>Full Stack Developer & Automation Enthusiast</h6>
                  </div>
                </div>
                <div className="col-md-12 text-center mt-4">
                  <div className="team-grids">
                    <img src={team3} className="img-fluid mb-3" alt="Team Member" style={{ width: '200px', height: 'auto' }} />
                    <h4>S.M. Nabiul Islam</h4>
                    <h6>Project Manager & Full Stack Developer</h6>
                  </div>
                </div>
                <div className="col-md-12 text-center mt-4">
                  <div className="team-grids">
                    <img src={team2} className="img-fluid mb-3" alt="Team Member" style={{ width: '200px', height: 'auto' }} />
                    <h4>Md. Mezabur Rahman Rasel</h4>
                    <h6>Front End Developer & Graphics Designer</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
