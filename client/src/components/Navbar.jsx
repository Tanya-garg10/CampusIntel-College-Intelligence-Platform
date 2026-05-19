import { Link, useLocation } from 'react-router-dom';
import { Lightbulb, PlusCircle, LayoutList, LogIn } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Lightbulb size={28} color="#3b82f6" />
          CampusIntel
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className={isActive("/dashboard")}>
            <span className="flex items-center gap-2">Dashboard</span>
          </Link>
          <Link to="/calendar" className={isActive("/calendar")}>
            <span className="flex items-center gap-2">Calendar</span>
          </Link>
          <Link to="/ai-mentor" className={isActive("/ai-mentor")}>
            <span className="flex items-center gap-2">AI Mentor</span>
          </Link>
          <Link to="/feed" className={isActive("/feed")}>
            <span className="flex items-center gap-2"><LayoutList size={18} /> Feed</span>
          </Link>
          <Link to="/add-post" className={isActive("/add-post")}>
            <span className="flex items-center gap-2"><PlusCircle size={18} /> Add Post</span>
          </Link>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            <span className="flex items-center gap-2"><LogIn size={18} /> Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
