import { ArrowUp, MapPin, Tag, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { logActivity, toggleBookmark } from '../utils/activityLogger';

const PostCard = ({ post }) => {
  const [trustScore, setTrustScore] = useState(post.trustScore || 0);
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(bookmarks.some(b => b._id === post._id));
  }, [post._id]);

  const handleUpvote = async () => {
    if (upvoted) return;
    try {
      // Upvote directly in Firebase Firestore
      const postRef = doc(db, "posts", post._id);
      await updateDoc(postRef, {
        trustScore: increment(1)
      });
      
      setTrustScore(prev => prev + 1);
      setUpvoted(true);
      logActivity(`Upvoted opportunity: "${post.title}"`);
    } catch (error) {
      console.error("Error upvoting in Firestore:", error);
    }
  };

  const handleBookmark = () => {
    const isSaved = toggleBookmark(post);
    setBookmarked(isSaved);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <span className="badge badge-outline">{post.category}</span>
          <span className={`badge badge-${post.urgency}`}>{post.urgency} priority</span>
        </div>
        <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{post.title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{post.description}</p>

      <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="flex gap-4 text-secondary" style={{ fontSize: '0.875rem' }}>
          <span className="flex items-center gap-2"><MapPin size={16} /> {post.college}</span>
          <span className="flex items-center gap-2"><Tag size={16} /> {post.branch}</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleBookmark}
            className={`btn ${bookmarked ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '99px' }}
          >
            <Bookmark size={16} />
          </button>
          
          <button 
            onClick={handleUpvote} 
            className={`btn ${upvoted ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1rem', borderRadius: '99px' }}
          >
            <ArrowUp size={16} />
            {trustScore}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
