import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col">
          <div className="footer__brand">
            <span className="navbar__mark navbar__mark--light">L</span>
            <span>Lemer Public School</span>
          </div>
          <p className="footer__tagline">
            Educating curious, capable, kind young people since 1978.
          </p>
        </div>

        <div className="footer__col">
          <h3>Explore</h3>
          <Link to="/about">About us</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/admissions">Admission form</Link>
        </div>

        <div className="footer__col">
          <h3>Visit</h3>
          <p>Triprayar</p>
          <p>Thrissur, Kerala, India</p>
          <p>+91 98765 43210</p>
          <p>admissions@lemerpublicschool.edu</p>
        </div>

        <div className="footer__col">
          <h3>Office hours</h3>
          <p>Monday – Friday</p>
          <p>7:30am – 4:00pm</p>
          <Link to="/contact">Send a message →</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {year} Lemer Public School. All rights reserved.</p>
      </div>
    </footer>
  );
}
