import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        TaskFlow
      </Link>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/tasks">My Tasks</Link>
      </div>
    </nav>
  );
}

export default Navbar;