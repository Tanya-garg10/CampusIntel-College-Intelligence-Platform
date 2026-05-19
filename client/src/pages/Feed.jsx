import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Filter } from 'lucide-react';
import { getMockPosts } from '../utils/mockDb';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', urgency: '' });

  const loadPosts = () => {
    setLoading(true);
    let allPosts = getMockPosts();

    // Client-side filtering
    if (filters.category) {
      allPosts = allPosts.filter(p => p.category === filters.category);
    }
    if (filters.urgency) {
      allPosts = allPosts.filter(p => p.urgency === filters.urgency);
    }

    // Sort by newest first
    allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setPosts(allPosts);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();

    // Listen for new posts added (real-time simulation!)
    window.addEventListener('mockPostsUpdated', loadPosts);
    return () => window.removeEventListener('mockPostsUpdated', loadPosts);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2>Intelligence Feed</h2>
        
        <div className="flex gap-4 items-center">
          <Filter size={20} color="var(--text-secondary)" />
          <select 
            name="category" 
            className="select-field" 
            style={{ width: 'auto', padding: '0.5rem' }}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="placement">Placement</option>
            <option value="academics">Academics</option>
            <option value="clubs">Clubs</option>
            <option value="scholarships">Scholarships</option>
            <option value="other">Other</option>
          </select>
          
          <select 
            name="urgency" 
            className="select-field" 
            style={{ width: 'auto', padding: '0.5rem' }}
            onChange={handleFilterChange}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>Loading intelligence...</div>
      ) : posts.length === 0 ? (
        <div className="glass-panel text-center">
          <p>No posts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {posts.map(post => (
            <PostCard key={post._id} post={post} onUpdate={loadPosts} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
