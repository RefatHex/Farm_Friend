import React from "react";
import "./Blog.css";
import teamReBuggers from "../assets/images/TeamReBuggers.jpeg";
import electronics from "../assets/images/Electronics.jpg";
import resQ from "../assets/images/ResQ.jpg";
import aram from "../assets/images/aram.jpg";

const Blog = () => {
  const blogPosts = [
    {
      image: resQ,
      date: "May 15, 2025",
      author: "Nabiul Islam Nabil",
      comments: 10,
      title:
        "🏆 Champion - Team ReBuggers won UIU CSE Project Show Spring 2025 for ResQ!",
      link: "https://www.linkedin.com/posts/nabiul-islam-nabil_resq-rebuggers101-uiuprojectshow-activity-7358218603650797568-gS6K?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD6PKR8BUMV0dJoI6SYUz03WvjXbUo0djYc",
      badge: "champion",
    },
    {
      image: aram,
      date: "August 20, 2025",
      author: "Nabiul Islam Nabil",
      comments: 7,
      title:
        "🥉 3rd Runner Up - Team ReBuggers at UIU CSE Project Show Summer 2025 for ARAM!",
      link: "https://www.linkedin.com/posts/nabiul-islam-nabil_aram-rebuggers-uiuprojectshow-activity-7403866559925911552-VeY-?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD6PKR8BUMV0dJoI6SYUz03WvjXbUo0djYc",
      badge: "runner-up",
    },
    {
      image: teamReBuggers,
      date: "December 18, 2023",
      author: "Nabiul Islam Nabil",
      comments: 3,
      title:
        "🎖️ 5th Runner Up - Team ReBuggers at UIU CSE Project Show Fall 2023 for EasyNeeds",
      link: "https://www.linkedin.com/posts/nabiul-islam-nabil_it-was-a-great-experience-yesterday-as-me-activity-7142763104874000384-cwl7?utm_source=share&utm_medium=member_desktop",
      badge: "finalist",
    },
    {
      image: electronics,
      date: "October 11, 2024",
      author: "Nabiul Islam Nabil",
      comments: 2,
      title:
        "Team ReBuggers made a River Analysis Boat for CSE Project Show Summer 2024",
      link: "https://www.linkedin.com/posts/nabiul-islam-nabil_project-overview-river-analysis-boat-rab-activity-7250177963902615553-xcAj?utm_source=share&utm_medium=member_desktop",
    },
  ];

  return (
    <section className="ftco-section bg-light blog-section">
      <div className="container">
        <div className="row justify-content-center pb-5 mb-3">
          <div className="col-md-7 heading-section text-center ftco-animate">
            <h2>আমাদের সম্পর্কে নতুন তথ্যাদি</h2>
          </div>
        </div>
        <div className="row d-flex justify-content-center blog-grid">
          {blogPosts.map((post, index) => (
            <div key={index} className="blog-card">
              <div className={`blog-entry ${post.badge ? post.badge : ""}`}>
                {post.badge && (
                  <div className={`achievement-badge ${post.badge}`}>
                    {post.badge === "champion" && "🏆 Champion"}
                    {post.badge === "runner-up" && "🥉 3rd Runner Up"}
                    {post.badge === "finalist" && "🎖️ 5th Runner Up"}
                  </div>
                )}
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-img-link"
                >
                  <img src={post.image} alt={post.title} className="blog-img" />
                </a>
                <div className="text p-4">
                  <div className="meta mb-2">
                    <div>
                      <span>{post.date}</span>
                    </div>
                    <div>
                      <span>{post.author}</span>
                    </div>
                    <div>
                      <span className="meta-chat">
                        <span className="fa fa-comment">💬</span>{" "}
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <h3 className="heading">{post.title}</h3>
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
