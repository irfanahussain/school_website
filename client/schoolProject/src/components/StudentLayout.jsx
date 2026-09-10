import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const NAV = [
  { to: "/dashboard", label: "Home", end: true },
  { to: "/dashboard/courses", label: "My Courses", end: false },
  { to: "/dashboard/profile", label: "Profile", end: false },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const initial = (user?.full_name || user?.email || "S").charAt(0).toUpperCase();

  return (
    <section className="student">
      <header className="student__topbar">
        <button
          type="button"
          className="student__hamburger"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <NavLink to="/dashboard" className="student__brand">
          Softspire Learning
        </NavLink>

        <NavLink to="/dashboard/profile" className="student__topbar-avatar" aria-label="Profile">
          {user?.avatar ? <img src={user.avatar} alt="" /> : initial}
        </NavLink>
      </header>

      {drawerOpen && (
        <div className="student__drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      )}

      <aside className={"student__drawer" + (drawerOpen ? " student__drawer--open" : "")}>
        <button
          type="button"
          className="student__drawer-close"
          aria-label="Close menu"
          onClick={() => setDrawerOpen(false)}
        >
          ×
        </button>

        <div className="student__identity">
          <span className="student__avatar" aria-hidden="true">
            {user?.avatar ? <img src={user.avatar} alt="" /> : initial}
          </span>
          <div>
            <p className="student__name">{user?.full_name}</p>
            <p className="student__email">{user?.email}</p>
          </div>
        </div>

        <nav className="student__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) =>
                "student__nav-link" + (isActive ? " student__nav-link--active" : "")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="student__logout" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <div className="student__content">
        <Outlet />
      </div>
    </section>
  );
}
