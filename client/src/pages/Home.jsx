import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Users } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">Unlock Senior Intelligence.</h1>
        <p className="hero-subtitle">
          CampusIntel bridges the gap between seniors and juniors. Get real-time updates on placements, academics, and college events straight from the source.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/feed" className="btn btn-primary">
            Explore Feed
          </Link>
          <Link to="/add-post" className="btn btn-outline">
            Share Insights
          </Link>
        </div>
      </section>

      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-panel text-center">
          <div className="flex justify-center mb-4" style={{ color: 'var(--accent-color)' }}>
            <Zap size={48} />
          </div>
          <h3>Real-time Updates</h3>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Get notified about placement drives, important academic changes, and crucial campus news instantly.</p>
        </div>
        
        <div className="glass-panel text-center">
          <div className="flex justify-center mb-4" style={{ color: 'var(--success)' }}>
            <ShieldCheck size={48} />
          </div>
          <h3>Trust Score System</h3>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Our unique upvote system ensures you only see the most reliable and verified information.</p>
        </div>
        
        <div className="glass-panel text-center">
          <div className="flex justify-center mb-4" style={{ color: 'var(--warning)' }}>
            <Users size={48} />
          </div>
          <h3>Community Driven</h3>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Built by students, for students. A centralized knowledge base for your entire college journey.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
