import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";

const NAV = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/dashboard/courses", label: "My Courses", end: false },
  { to: "/dashboard/profile", label: "Profile", end: false },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const initial = (user?.full_name || user?.email || "S").charAt(0).toUpperCase();

  return (
    <section className="student">
      <aside className="student__sidebar">
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