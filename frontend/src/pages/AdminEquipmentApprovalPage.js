import React, { useState } from 'react';
import './AdminEquipmentApprovalPage.css';

// Demo data for pending equipment posts
const pendingPosts = [
  {
    id: 1,
    name: 'Tractor',
    description: 'Powerful tractor for field work.',
    price: 120,
    user: 'Rahim',
    image: require('../assets/images/tractor.jpg'),
  },
  {
    id: 2,
    name: 'Seeder',
    description: 'Seeder for fast and uniform seed planting.',
    price: 60,
    user: 'Karim',
    image: require('../assets/images/seeder.jpg'),
  },
];

function AdminEquipmentApprovalPage() {
  const [posts, setPosts] = useState(pendingPosts);
  const [action, setAction] = useState({});

  const handleApprove = (id) => {
    setAction({ ...action, [id]: 'approved' });
  };
  const handleReject = (id) => {
    setAction({ ...action, [id]: 'rejected' });
  };

  return (
    <div className="admin-approval-container">
      <h2>Admin Equipment Approval</h2>
      {posts.length === 0 ? (
        <p>No pending posts.</p>
      ) : (
        <div className="admin-approval-list">
          {posts.map(post => (
            <div className="admin-approval-card" key={post.id}>
              <img src={post.image} alt={post.name} className="admin-approval-img" />
              <div className="admin-approval-info">
                <h3>{post.name}</h3>
                <p>{post.description}</p>
                <div className="admin-approval-meta">
                  <span>User: {post.user}</span>
                  <span>৳{post.price}/day</span>
                </div>
                {action[post.id] ? (
                  <div className={`admin-action-message ${action[post.id]}`}>{action[post.id].toUpperCase()}</div>
                ) : (
                  <div className="admin-approval-actions">
                    <button className="approve" onClick={() => handleApprove(post.id)}>Approve</button>
                    <button className="reject" onClick={() => handleReject(post.id)}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminEquipmentApprovalPage;
