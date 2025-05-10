import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./Navbar.css";

export default function Navbar() {
  const { t } = useTranslation();
  return (
    <nav className="custom-navbar">
      <ul className="nav-links">
        <li><Link to="/" className="nav-btn">{t('pageTitleSearchFuelStations')}</Link></li>
        <li><Link to="/about" className="nav-btn">{t('pageTitleAbout')}</Link></li>
      </ul>
    </nav>
  );
}
