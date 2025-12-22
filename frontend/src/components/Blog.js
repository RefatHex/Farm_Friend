import React from 'react';
import './Blog.css';
import teamReBuggers from '../assets/images/TeamReBuggers.jpeg';
import electronics from '../assets/images/Electronics.jpg';
import reBuggers from '../assets/images/ReBuggers.jpg';

const Blog = () => {
  const blogPosts = [
    {
      image: teamReBuggers,
      date: 'December 18, 2023',
      author: 'Nabiul Islam Nabil',
      comments: 3,
      title: 'Team ReBuggers secured a winning position in UIU CSE Project Show Fall 2023 For EasyNeeds',
      link: 'https://www.linkedin.com/posts/nabiul-islam-nabil_it-was-a-great-experience-yesterday-as-me-activity-7142763104874000384-cwl7?utm_source=share&utm_medium=member_desktop'
    },
    {
      image: electronics,
      date: 'October 11, 2024',
      author: 'Nabiul Islam Nabil',
      comments: 2,
      title: 'Team ReBuggers made a River Analysis Boat for CSE Project Show Summer 2024',
      link: 'https://www.linkedin.com/posts/nabiul-islam-nabil_project-overview-river-analysis-boat-rab-activity-7250177963902615553-xcAj?utm_source=share&utm_medium=member_desktop'
    },
    {
      image: reBuggers,
      date: 'January 27, 2025',
      author: 'Nabiul Islam Nabil',
      comments: 5,
      title: 'Team ReBuggers made FarmFriend for farmers to add innovation in farming.',
      link: 'https://www.linkedin.com/posts/nabiul-islam-nabil_project-overview-river-analysis-boat-rab-activity-7250177963902615553-xcAj?utm_source=share&utm_medium=member_desktop'
    }
  ];

  return (
    <section className="ftco-section bg-light blog-section">
      <div className="container">
        <div className="row justify-content-center pb-5 mb-3">
          <div className="col-md-7 heading-section text-center ftco-animate">
            <h2>আমাদের সম্পর্কে নতুন তথ্যাদি</h2>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          {blogPosts.map((post, index) => (
            <div key={index} className="col-md-4 d-flex ftco-animate">
              <div className="blog-entry align-self-stretch">
                <a 
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block-20 rounded"
                  style={{ backgroundImage: `url(${post.image})` }}
                >
                </a>
                <div className="text p-4">
                  <div className="meta mb-2">
                    <div><a href="#">{post.date}</a></div>
                    <div><a href="#">{post.author}</a></div>
                    <div><a href="#" className="meta-chat"><span className="fa fa-comment">💬</span> {post.comments}</a></div>
                  </div>
                  <h3 className="heading">
                    {post.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
