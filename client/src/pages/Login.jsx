import { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, GraduationCap, Building } from 'lucide-react';
import { logActivity } from '../utils/activityLogger';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [role, setRole] = useState('junior');
  const [isPersonalEmail, setIsPersonalEmail] = useState(false);

  const handleAuthAction = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated network delay (Feels highly realistic for presentation)
    setTimeout(() => {
      // 1. Email Domain check logic (WOW factor remains!)
      if (!isPersonalEmail && !email.endsWith('.edu') && !email.includes('college')) {
        setError('Please toggle Personal Email if you do not have an official college domain.');
        setLoading(false);
        return;
      }

      const mockUid = "user_" + Math.random().toString(36).substr(2, 9);

      const sessionUser = {
        uid: mockUid,
        email: email,
        name: isRegister ? name : (email.split('@')[0].toUpperCase()),
        college: isRegister ? college : "State Engineering College",
        branch: isRegister ? branch : "Computer Science",
        role: isRegister ? role : (email.includes('senior') ? 'senior' : 'junior'),
        trustScore: isRegister ? (role === 'senior' ? 5 : 1) : 10, // Seniors start with high trust
        skills: isRegister ? [] : ["React", "Python", "Data Structures"],
        verified: !isPersonalEmail, // Auto-verified if using college domain!
        links: { linkedin: "", github: "" }
      };

      // Save user session in localStorage
      localStorage.setItem('user', JSON.stringify(sessionUser));

      if (isRegister) {
        logActivity(`Registered new user account: ${sessionUser.name}`);
      } else {
        logActivity(`Logged into system: ${sessionUser.name}`);
      }

      setLoading(false);

      // Clean full-page navigation so Navbar/Dashboard pick up the new session
      window.location.href = '/feed';
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '3rem auto' }}>
      <div className="text-center mb-8">
        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: 'var(--accent-color)', marginBottom: '1rem' }}>
          <ShieldCheck size={40} />
        </div>
        <h2>{isRegister ? 'Join CampusIntel' : 'Welcome Back'}</h2>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
          {isRegister ? 'Democratize institutional campus intelligence' : 'Securely access verified peer insights'}
        </p>
      </div>

      <div className="glass-panel">
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuthAction}>
          {isRegister && (
            <>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="E.g., Arpan Garg"
                    style={{ paddingLeft: '2.75rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">College Name</label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="E.g., State Engineering College"
                    style={{ paddingLeft: '2.75rem' }}
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Branch/Major</label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="E.g., Computer Science"
                    style={{ paddingLeft: '2.75rem' }}
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Your Campus Role</label>
                <select className="select-field" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="junior">Junior (Seeking Guidance)</option>
                  <option value="senior">Senior (Verified Knowledge Sharer)</option>
                </select>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                className="input-field"
                placeholder={isPersonalEmail ? "you@example.com" : "you@college.edu"}
                style={{ paddingLeft: '2.75rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                style={{ paddingLeft: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Domain Switcher (WOW Factor Toggle) */}
          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              id="personal-toggle"
              checked={isPersonalEmail}
              onChange={(e) => setIsPersonalEmail(e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
            <label htmlFor="personal-toggle" style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              I don't have a college email ID (Use personal email)
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6" style={{ fontSize: '0.875rem' }}>
          <span className="text-secondary">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
          </span>{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-primary"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}
          >
            {isRegister ? 'Sign In' : 'Register now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
