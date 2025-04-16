import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="custom-navbar">
      <ul className="nav-links">
        <li><Link to="/" className="nav-btn">Fuel Stations Map</Link></li>
        <li><Link to="/about" className="nav-btn">About</Link></li>
      </ul>
    </nav>
  );
}
