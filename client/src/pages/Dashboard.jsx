import { useState, useEffect } from 'react';
import { Award, Target, BookMarked, Activity, ShieldCheck, Edit, Plus, Trash } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { logActivity } from '../utils/activityLogger';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeBadgeInfo, setActiveBadgeInfo] = useState(null);

  // Edit profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    college: '',
    branch: '',
    skills: '',
    linkedin: '',
    github: ''
  });

  const badgesList = [
    { title: "Academic Guide", desc: "Share 3 academic posts to unlock", unlocked: true, color: 'var(--accent-color)' },
    { title: "Placement Guru", desc: "Upvote 5 high priority placement alerts", unlocked: false, color: 'var(--warning)' },
    { title: "Verified Contributor", desc: "Obtain a trust score of 10+", unlocked: false, color: 'var(--success)' }
  ];

  const fetchLiveDashboard = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      try {
        // Fetch user from Firestore
        const userDoc = await getDoc(doc(db, "users", parsedUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setProfileForm({
            name: userData.name || '',
            college: userData.college || '',
            branch: userData.branch || '',
            skills: userData.skills?.join(', ') || '',
            linkedin: userData.links?.linkedin || '',
            github: userData.links?.github || ''
          });
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error fetching live user doc:", error);
        setUser(parsedUser);
      }
    }
    
    // Fetch live local storage values (bookmarks & activities)
    setSavedPosts(JSON.parse(localStorage.getItem('bookmarks') || '[]'));
    setActivities(JSON.parse(localStorage.getItem('activities') || '[]'));
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveDashboard();

    // Listen to live bookmarks/activity triggers
    window.addEventListener('bookmarksUpdated', fetchLiveDashboard);
    window.addEventListener('activityUpdated', fetchLiveDashboard);

    return () => {
      window.removeEventListener('bookmarksUpdated', fetchLiveDashboard);
      window.removeEventListener('activityUpdated', fetchLiveDashboard);
    };
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", user.uid);
      const updatedFields = {
        name: profileForm.name,
        college: profileForm.college,
        branch: profileForm.branch,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        links: {
          linkedin: profileForm.linkedin,
          github: profileForm.github
        }
      };

      await updateDoc(userRef, updatedFields);
      
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      logActivity("Updated profile details and skills");
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update profile in Firestore:", error);
      alert("Error saving profile details: " + error.message);
    }
  };

  const removeBookmark = (postId) => {
    const updated = savedPosts.filter(p => p._id !== postId);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    setSavedPosts(updated);
    logActivity("Removed saved opportunity from dashboard");
  };

  if (loading) return <div className="text-center py-8">Loading your dashboard...</div>;
  if (!user) return <div className="text-center py-8">Please log in to view your dashboard.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2>Student Dashboard</h2>
        <button onClick={() => setShowEditModal(true)} className="btn btn-outline flex items-center gap-2">
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card text-center" style={{ borderTop: '4px solid var(--accent-color)' }}>
          <ShieldCheck size={32} color="var(--accent-color)" className="mx-auto mb-2" style={{margin: '0 auto'}}/>
          <h3 style={{fontSize: '1.75rem', marginTop: '0.5rem'}}>{user.trustScore || 0}</h3>
          <p className="text-secondary" style={{fontSize: '0.875rem'}}>Reputation / Trust Score</p>
        </div>
        
        <div className="card text-center" style={{ borderTop: '4px solid var(--success)' }}>
          <Award size={32} color="var(--success)" className="mx-auto mb-2" style={{margin: '0 auto'}}/>
          <h3 style={{fontSize: '1.75rem', marginTop: '0.5rem'}}>1 / {badgesList.length}</h3>
          <p className="text-secondary" style={{fontSize: '0.875rem'}}>Achievement Badges</p>
        </div>

        <div className="card text-center" style={{ borderTop: '4px solid var(--warning)' }}>
          <BookMarked size={32} color="var(--warning)" className="mx-auto mb-2" style={{margin: '0 auto'}}/>
          <h3 style={{fontSize: '1.75rem', marginTop: '0.5rem'}}>{savedPosts.length}</h3>
          <p className="text-secondary" style={{fontSize: '0.875rem'}}>Saved Opportunities</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Section: Saved Opportunities & Activities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Dynamic Saved Opportunities */}
          <div className="glass-panel">
            <h3 className="mb-4 flex items-center gap-2"><BookMarked size={20} /> Bookmarked Opportunities</h3>
            {savedPosts.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No bookmarks saved yet. Click the bookmark icon on any opportunity card in the feed!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {savedPosts.map(post => (
                  <div key={post._id} className="card flex items-center justify-between" style={{ padding: '1rem 1.5rem', background: 'var(--bg-dark)' }}>
                    <div>
                      <span className="badge badge-outline" style={{ fontSize: '0.65rem' }}>{post.category}</span>
                      <h4 style={{ margin: '0.25rem 0', fontSize: '1.1rem' }}>{post.title}</h4>
                      <small className="text-secondary">{post.college}</small>
                    </div>
                    <button 
                      onClick={() => removeBookmark(post._id)}
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem', borderRadius: '50%', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Activity List */}
          <div className="glass-panel">
            <h3 className="flex items-center gap-2 mb-4"><Activity size={20} /> Live Activity Log</h3>
            {activities.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Your actions (upvotes, saves, edits) will track here in real-time!</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {activities.map((act, idx) => (
                  <li key={idx} className="mb-3 pb-3" style={{ borderBottom: idx !== activities.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{act.text}</p>
                    <small className="text-secondary" style={{ fontSize: '0.75rem' }}>{act.timestamp}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Section: Badges & Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Profile Card */}
          <div className="glass-panel">
            <h3 className="flex items-center gap-2 mb-4"><Target size={20} /> Student Profile</h3>
            <p className="mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="mb-2"><strong>College:</strong> {user.college}</p>
            <p className="mb-2"><strong>Branch:</strong> {user.branch}</p>
            <p className="mb-2"><strong>Role:</strong> <span className="badge badge-outline">{user.role}</span></p>
            
            {user.skills && user.skills.length > 0 && (
              <div className="mt-4">
                <strong>Skills:</strong>
                <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
                  {user.skills.map((skill, idx) => (
                    <span key={idx} className="badge badge-outline" style={{ fontSize: '0.75rem' }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {user.verified && <p className="text-success flex items-center gap-2 mt-4"><ShieldCheck size={16}/> Verified Account</p>}
          </div>

          {/* Gamification Badges */}
          <div className="glass-panel">
            <h3 className="flex items-center gap-2 mb-4"><Award size={20} /> Badges Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {badgesList.map((badge, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveBadgeInfo(badge)}
                  className="card flex items-center gap-3 cursor-pointer" 
                  style={{ 
                    padding: '0.75rem 1rem', 
                    background: badge.unlocked ? 'rgba(30, 41, 59, 0.4)' : 'rgba(15, 23, 42, 0.6)',
                    opacity: badge.unlocked ? 1 : 0.6,
                    borderLeft: `4px solid ${badge.color}`
                  }}
                >
                  <Award size={20} color={badge.color} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{badge.title}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {badge.unlocked ? "Unlocked 🎉" : "Locked 🔒"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Glassmorphic Badge Info Pop-up */}
      {activeBadgeInfo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel text-center" style={{ maxWidth: '400px', width: '90%' }}>
            <Award size={48} color={activeBadgeInfo.color} style={{ margin: '0 auto 1rem' }} />
            <h3>{activeBadgeInfo.title}</h3>
            <p className="mt-4 mb-6" style={{ color: 'var(--text-secondary)' }}>{activeBadgeInfo.desc}</p>
            <button onClick={() => setActiveBadgeInfo(null)} className="btn btn-primary" style={{ width: '100%' }}>Close Details</button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal Dialog */}
      {showEditModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ maxWidth: '500px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="mb-4">Update Profile Details</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profileForm.name} 
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required 
                />
              </div>
              <div className="input-group">
                <label className="input-label">College Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profileForm.college} 
                  onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                  required 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Branch</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profileForm.branch} 
                  onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                  required 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Skills (Comma-separated)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="React, CSS, Node, Python" 
                  value={profileForm.skills} 
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">LinkedIn URL</label>
                <input 
                  type="url" 
                  className="input-field" 
                  value={profileForm.linkedin} 
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">GitHub URL</label>
                <input 
                  type="url" 
                  className="input-field" 
                  value={profileForm.github} 
                  onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
