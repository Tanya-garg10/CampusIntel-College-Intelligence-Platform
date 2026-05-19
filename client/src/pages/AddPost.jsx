import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMockPost } from '../utils/mockDb';
import { logActivity } from '../utils/activityLogger';

const AddPost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'placement',
    urgency: 'low',
    college: '',
    branch: '',
    anonymous: false
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        college: parsedUser.college || '',
        branch: parsedUser.branch || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay for realistic UX feel
    setTimeout(() => {
      addMockPost({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
        college: formData.college || 'State Engineering College',
        branch: formData.branch || 'Computer Science',
        anonymous: formData.anonymous,
        createdBy: currentUser?.uid || 'Anonymous',
      });

      logActivity(`Broadcast "${formData.title}" to campus`);
      setLoading(false);
      navigate('/feed');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-8 text-center">Share Intelligence</h2>
      
      <div className="glass-panel">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Title</label>
            <input 
              type="text" 
              name="title" 
              className="input-field" 
              placeholder="E.g., TCS Ninja Campus Drive announced" 
              value={formData.title} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Category</label>
            <select 
              name="category" 
              className="select-field" 
              value={formData.category} 
              onChange={handleChange}
            >
              <option value="placement">Placement</option>
              <option value="academics">Academics</option>
              <option value="clubs">Clubs</option>
              <option value="scholarships">Scholarships</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Priority/Urgency</label>
            <select 
              name="urgency" 
              className="select-field" 
              value={formData.urgency} 
              onChange={handleChange}
            >
              <option value="low">Low (General Info)</option>
              <option value="medium">Medium (Upcoming Deadlines)</option>
              <option value="high">High (Immediate Action Required)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Detailed Description</label>
            <textarea 
              name="description" 
              className="textarea-field" 
              rows="5" 
              placeholder="Provide all necessary details, links, and instructions..."
              value={formData.description} 
              onChange={handleChange}
              required 
            ></textarea>
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="checkbox" 
              name="anonymous" 
              id="anonymous-toggle"
              checked={formData.anonymous} 
              onChange={handleChange}
              style={{ width: 'auto', transform: 'scale(1.25)', cursor: 'pointer' }}
            />
            <label htmlFor="anonymous-toggle" style={{ margin: 0, cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Broadcast Anonymously (Hide your identity from juniors)
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Broadcasting...' : 'Broadcast to Campus'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
