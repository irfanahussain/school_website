import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Courses" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

const CATEGORIES = [
  { to: "/courses?stage=primary", label: "Foundation (8-10)" },
  { to: "/courses?stage=middle", label: "Class 11 & 12" },
  { to: "/courses?stage=high", label: "Competitive & Dropper" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 860) setOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4.65" y1="13.41" x2="13.41" y2="4.65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="7.62" y1="16.38" x2="16.38" y2="7.62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="10.59" y1="19.35" x2="19.35" y2="10.59" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          <span className="navbar__name">
            Soft<em>spire</em>
          </span>
        </NavLink>

        <button
          className="navbar__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links ${open ? "navbar__links--open" : ""}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                "navbar_link" + (isActive ? " navbar_link--active" : "")
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="navbar__categories">
            <p className="navbar__categories-heading">Popular categories</p>
            {CATEGORIES.map((cat) => (
              <NavLink key={cat.to} to={cat.to} className="navbar__category" onClick={() => setOpen(false)}>
                {cat.label}
              </NavLink>
            ))}
          </div>

          <div className="navbar__auth">
            {status === "ready" && user ? (
              <>
                <span className="navbar__greeting">Hi, {user.full_name}</span>
                <button type="button" className="navbar_link navbar_link--button" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="navbar__link" onClick={() => setOpen(false)}>
                  Log in
                </NavLink>
                <NavLink to="/register" className="navbar__link" onClick={() => setOpen(false)}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          <NavLink to="/admissions" className="navbar__cta" onClick={() => setOpen(false)}>
            Enroll Now
          </NavLink>
        </nav>
      </div>
    </header>
  );
}