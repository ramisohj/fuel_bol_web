import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> May 16, 2025</p>

      <p>
        Fuel Bol (“we”, “our”, or “us”) respects your privacy and is committed to protecting your information.
        This Privacy Policy explains how our app handles user data.
      </p>

      <h2 style={styles.subheader}>1. Regional Scope</h2>
      <p>
        Fuel Bol is intended for use <strong>exclusively within Bolivia</strong>. All app features, services,
        and data are designed and optimized for users located in Bolivia.
      </p>

      <h2 style={styles.subheader}>2. Information We Collect</h2>
      <p>
        Fuel Bol uses your device’s <strong>location (GPS)</strong> to show your current position on the map.
        We <strong>do not collect</strong>, <strong>store</strong>, or <strong>share</strong> any personally identifiable information.
        Your location data is used <strong>only in real-time</strong> and never stored on our servers.
      </p>

      <h2 style={styles.subheader}>3. How We Use Your Information</h2>
      <p>
        The GPS data is used <strong>solely</strong> to display your current location on the map for navigation and user experience.
        We do <strong>not</strong> track users across sessions, store personal data, or share any information with third parties.
      </p>

      <h2 style={styles.subheader}>4. Third-Party Services</h2>
      <p>
        Fuel Bol uses:
        <ul>
          <li><strong>Mapbox SDK</strong> for map rendering and GPS functionality.</li>
        </ul>
        Mapbox may collect anonymized data in accordance with their own{" "}
        <a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>.
      </p>

      <h2 style={styles.subheader}>5. Your Privacy Rights</h2>
      <p>
        Since we do not collect or store personal data, there is no need to request access, changes, or deletion of your information.
        You may revoke location access at any time through your device settings, but doing so may limit app functionality.
      </p>

      <h2 style={styles.subheader}>6. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please contact us at:<br />
        📧 <strong>[your email here]</strong>
      </p>

      <h2 style={styles.subheader}>7. Disclaimer</h2>
      <p>
        Fuel Bol is an <strong>independent application</strong> and is <strong>not affiliated with or endorsed by any government agency</strong>.
        The app displays public fuel station data based on open sources and does not represent a government entity.
      </p>

      <footer style={styles.footer}>
        &copy; 2025 Fuel Bol. All rights reserved.
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "800px",
    margin: "3rem auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0,0,0,0.05)",
    color: "#333",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    lineHeight: 1.6,
  },
  header: {
    color: "#2c3e50",
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  subheader: {
    color: "#2c3e50",
    fontSize: "1.4rem",
    marginTop: "2rem",
  },
  footer: {
    marginTop: "2rem",
    fontSize: "0.9rem",
    color: "#777",
    textAlign: "center",
  },
};

export default PrivacyPolicy;
