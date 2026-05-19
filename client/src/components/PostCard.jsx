import { ArrowUp, MapPin, Tag, Bookmark, Sparkles, EyeOff, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { upvoteMockPost } from '../utils/mockDb';
import { logActivity, toggleBookmark } from '../utils/activityLogger';

const PostCard = ({ post, onUpdate }) => {
  const [trustScore, setTrustScore] = useState(post.trustScore || 0);
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(bookmarks.some(b => b._id === post._id));
  }, [post._id]);

  const handleUpvote = () => {
    if (upvoted) return;
    const newScore = upvoteMockPost(post._id);
    setTrustScore(newScore);
    setUpvoted(true);
    logActivity(`Upvoted opportunity: "${post.title}"`);
    if (onUpdate) onUpdate();
  };

  const handleBookmark = () => {
    const isSaved = toggleBookmark(post);
    setBookmarked(isSaved);
  };

  const handleSummarize = async () => {
    if (summary) { setSummary(null); return; }
    setLoadingSummary(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiBaseUrl}/api/ai/summarize`, { description: post.description });
      setSummary(response.data.summary);
      logActivity(`Generated AI Summary for: "${post.title}"`);
    } catch (error) {
      setSummary("Summary engine offline. Make sure the Express server is running on port 5000.");
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

      {summary && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.85rem', borderRadius: '0.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#60a5fa', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} /> AI Key Highlights:
          </h4>
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{summary}</div>
        </div>
      )}

      <div style={{ marginBottom: '1.25rem' }}>
        <button onClick={handleSummarize} disabled={loadingSummary}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {loadingSummary ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <><Sparkles size={12} />{summary ? 'Hide Highlights' : 'AI Quick Summary'}</>}
        </button>
      </div>

      <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {post.anonymous ? (
            <span style={{ color: 'var(--warning)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <EyeOff size={16} /> Anonymous Contributor
            </span>
          ) : (
            <span style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={15} /> {post.college}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Tag size={15} /> {post.branch}</span>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleBookmark} className={`btn ${bookmarked ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 0.75rem', borderRadius: '99px' }}>
            <Bookmark size={16} />
          </button>
          <button onClick={handleUpvote} className={`btn ${upvoted ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUp size={16} /> {trustScore}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PostCard;
