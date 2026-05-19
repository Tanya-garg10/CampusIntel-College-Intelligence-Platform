import { ArrowUp, MapPin, Tag, Bookmark, Sparkles, EyeOff, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { logActivity, toggleBookmark } from '../utils/activityLogger';

const PostCard = ({ post }) => {
  const [trustScore, setTrustScore] = useState(post.trustScore || 0);
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  // AI summarizer state
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

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

  const handleSummarize = async () => {
    if (summary) {
      setSummary(null); // Toggle summary off
      return;
    }
    
    setLoadingSummary(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiBaseUrl}/api/ai/summarize`, {
        description: post.description
      });
      setSummary(response.data.summary);
      logActivity(`Generated AI Summary for: "${post.title}"`);
    } catch (error) {
      console.error("AI summarization failed:", error);
      setSummary("❌ Summary engine currently offline. Please try again in a moment.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', flexGrow: 1 }}>{post.description}</p>

      {/* Dynamic AI Summary Bubble Component */}
      {summary && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '0.75rem 1rem', 
            marginBottom: '1.25rem', 
            background: 'rgba(59, 130, 246, 0.05)', 
            border: '1px solid rgba(59, 130, 246, 0.2)', 
            fontSize: '0.85rem',
            borderRadius: '0.5rem' 
          }}
        >
          <h4 className="flex items-center gap-1 mb-2" style={{ fontSize: '0.9rem', color: '#60a5fa', fontWeight: '600' }}>
            <Sparkles size={14} /> AI Key Highlights:
          </h4>
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5', color: 'var(--text-primary)' }}>
            {summary}
          </div>
        </div>
      )}

      {/* AI Summary Activation Button */}
      <div className="flex" style={{ marginBottom: '1.25rem' }}>
        <button 
          onClick={handleSummarize}
          className="btn btn-outline"
          style={{ 
            padding: '0.4rem 0.8rem', 
            fontSize: '0.8rem', 
            border: '1px solid rgba(59, 130, 246, 0.3)', 
            color: '#60a5fa', 
            borderRadius: '0.375rem',
            cursor: 'pointer' 
          }}
          disabled={loadingSummary}
        >
          {loadingSummary ? (
            <span className="flex items-center gap-1">
              <Loader size={12} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              Analyzing Post...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Sparkles size={12} />
              {summary ? 'Hide Key Highlights' : 'AI Quick Summary'}
            </span>
          )}
        </button>
      </div>

      {/* Footer details */}
      <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <div className="flex gap-3 text-secondary" style={{ fontSize: '0.875rem', flexWrap: 'wrap' }}>
          {post.anonymous ? (
            <span className="flex items-center gap-2" style={{ color: 'var(--warning)', fontWeight: '500' }}>
              <EyeOff size={16} /> Anonymous Contributor
            </span>
          ) : (
            <>
              <span className="flex items-center gap-1.5"><MapPin size={15} /> {post.college}</span>
              <span className="flex items-center gap-1.5"><Tag size={15} /> {post.branch}</span>
            </>
          )}
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
      
      {/* Keyframe spinner style locally just in case */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PostCard;
