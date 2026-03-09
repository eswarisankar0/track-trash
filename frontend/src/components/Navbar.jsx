import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show navbar on login page
  if (location.pathname === "/login") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🗑️ Track Trash
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/bins" className="nav-link">Bins</Link>
          </li>
          <li className="nav-item">
            <Link to="/alerts" className="nav-link">Alerts</Link>
          </li>
          <li className="nav-item">
            <Link to="/collections" className="nav-link">Collections</Link>
          </li>
          <li className="nav-item">
            <Link to="/issues" className="nav-link">Issues</Link>
          </li>
          <li className="nav-item">
            <Link to="/notifications" className="nav-link">Notifications</Link>
          </li>
        </ul>

        <div className="nav-user">
          {user && <span className="user-name">{user.email}</span>}
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
