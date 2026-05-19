import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [usePersonalEmail, setUsePersonalEmail] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    collegeEmail: '',
    personalEmail: '',
    password: '',
    college: '',
    branch: '',
    role: 'junior'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const authEmail = usePersonalEmail ? formData.personalEmail : formData.collegeEmail;

    if (!authEmail) {
      alert("Please provide an email address.");
      setLoading(false);
      return;
    }

    try {
      let userCredential;
      if (isSignUp) {
        // Firebase Auth Signup
        userCredential = await createUserWithEmailAndPassword(auth, authEmail, formData.password);
        const user = userCredential.user;

        // Write User Profile directly to Firestore
        const userProfile = {
          uid: user.uid,
          name: formData.name,
          collegeEmail: formData.collegeEmail || null,
          personalEmail: formData.personalEmail || null,
          college: formData.college,
          branch: formData.branch,
          role: formData.role,
          trustScore: 0,
          verified: !usePersonalEmail, // Auto-verify if using college email
          badges: [],
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", user.uid), userProfile);
        localStorage.setItem('user', JSON.stringify(userProfile));
      } else {
        // Firebase Auth Login
        userCredential = await signInWithEmailAndPassword(auth, authEmail, formData.password);
        const user = userCredential.user;

        // Retrieve User Profile from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          localStorage.setItem('user', JSON.stringify(userDoc.data()));
        } else {
          // Fallback if doc doesn't exist yet
          const fallbackUser = { uid: user.uid, email: user.email, role: 'junior' };
          localStorage.setItem('user', JSON.stringify(fallbackUser));
        }
      }

      navigate('/feed');
    } catch (error) {
      console.error("Authentication failed", error);
      alert(`Authentication Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <div className="text-center mb-8">
        <Lightbulb size={48} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
        <h2>{isSignUp ? "Join CampusIntel" : "Welcome Back"}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isSignUp ? "Create your account to access campus intelligence" : "Sign in to your campus network"}
        </p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSubmit}>
          
          {isSignUp && (
            <div className="input-group">
              <label className="input-label">Full Name <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="name" 
                className="input-field" 
                placeholder="John Doe" 
                value={formData.name} 
                onChange={handleChange}
                required={isSignUp}
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address <span style={{color: 'red'}}>*</span></label>
            <div className="flex gap-4 mb-2" style={{ fontSize: '0.875rem' }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={!usePersonalEmail} 
                  onChange={() => setUsePersonalEmail(false)} 
                />
                College Email
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={usePersonalEmail} 
                  onChange={() => setUsePersonalEmail(true)} 
                />
                Personal Email
              </label>
            </div>
            
            {!usePersonalEmail ? (
              <input 
                type="email" 
                name="collegeEmail" 
                className="input-field" 
                placeholder="john@college.edu (Preferred)" 
                value={formData.collegeEmail} 
                onChange={handleChange}
                required={!usePersonalEmail}
              />
            ) : (
              <input 
                type="email" 
                name="personalEmail" 
                className="input-field" 
                placeholder="john@gmail.com" 
                value={formData.personalEmail} 
                onChange={handleChange}
                required={usePersonalEmail}
              />
            )}
            {!usePersonalEmail && <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem'}}>Use college email to automatically verify your profile.</p>}
          </div>

          <div className="input-group">
            <label className="input-label">Password <span style={{color: 'red'}}>*</span></label>
            <input 
              type="password" 
              name="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange}
              required 
              minLength="6"
            />
          </div>

          {isSignUp && (
            <>
              <div className="input-group">
                <label className="input-label">College Name <span style={{color: 'red'}}>*</span></label>
                <input 
                  type="text" 
                  name="college" 
                  className="input-field" 
                  placeholder="e.g., NIT Trichy" 
                  value={formData.college} 
                  onChange={handleChange}
                  required={isSignUp}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Branch / Department <span style={{color: 'red'}}>*</span></label>
                <input 
                  type="text" 
                  name="branch" 
                  className="input-field" 
                  placeholder="e.g., Computer Science" 
                  value={formData.branch} 
                  onChange={handleChange}
                  required={isSignUp}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Your Role <span style={{color: 'red'}}>*</span></label>
                <select 
                  name="role" 
                  className="select-field" 
                  value={formData.role} 
                  onChange={handleChange}
                >
                  <option value="junior">Junior (Seeking Knowledge)</option>
                  <option value="senior">Senior (Sharing Knowledge)</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent-color)', 
              marginLeft: '0.5rem', 
              cursor: 'pointer',
              fontWeight: '500' 
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
