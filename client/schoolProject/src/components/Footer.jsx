import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col">
          <div className="footer__brand">
            <span className="navbar_mark navbar_mark--light" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="4.65" y1="13.41" x2="13.41" y2="4.65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="7.62" y1="16.38" x2="16.38" y2="7.62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="10.59" y1="19.35" x2="19.35" y2="10.59" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            <span>Softspire Learning</span>
          </div>
          <p className="footer__tagline">
            Rise higher, together. Result-driven NEET, JEE and Foundation coaching led by
            expert mentors.
          </p>
          <div className="footer__social" aria-label="Social links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="YouTube">▶️</a>
          </div>
        </div>

        <div className="footer__col">
          <h3>Explore</h3>
          <Link to="/about">About us</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/admissions">Enrollment form</Link>
        </div>

        <div className="footer__col">
          <h3>Visit</h3>
          <p>CyberPark</p>
          <p>Kozhikode, Kerala, India</p>
          <p>+91 98765 43210</p>
          <p>admissions@softspirelearning.in</p>
        </div>

        <div className="footer__col">
          <h3>Office hours</h3>
          <p>Monday – Saturday</p>
          <p>8:00am – 7:00pm</p>
          <Link to="/contact">Send a message →</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {year} Softspire Learning. All rights reserved.</p>
      </div>
    </footer>
  );
}