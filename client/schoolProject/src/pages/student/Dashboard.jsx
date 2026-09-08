import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";
import { getMyCourses } from "../../api.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [courseCount, setCourseCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getMyCourses()
      .then((data) => {
        if (!cancelled) setCourseCount(data.length);
      })
      .catch(() => {
        if (!cancelled) setCourseCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <>
      <div className="student__header">
        <p className="eyebrow">Dashboard</p>
        <h1>Welcome back, {firstName}.</h1>
        <p className="student__lede">Here's a quick snapshot of your Softspire account.</p>
      </div>

      <div className="student__stats">
        <div className="student__stat-card">
          <span className="student__stat-value">{courseCount ?? "—"}</span>
          <p className="student__stat-label">Courses you're enrolled in</p>
        </div>
        <div className="student__stat-card">
          <span className="student__stat-value">Active</span>
          <p className="student__stat-label">Account status</p>
        </div>
      </div>

      <div className="student__quick-links">
        <Link to="/dashboard/courses" className="student__quick-link">
          <h3>Browse your courses</h3>
          <p>See the NEET, JEE and Foundation batches you can access.</p>
        </Link>
        <Link to="/dashboard/profile" className="student__quick-link">
          <h3>View your profile</h3>
          <p>Check the personal details on file for your account.</p>
        </Link>
        <Link to="/admissions" className="student__quick-link">
          <h3>Enroll in a new batch</h3>
          <p>Apply for an additional course or book a free demo class.</p>
        </Link>
      </div>
    </>
  );
}
