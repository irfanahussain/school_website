import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";
import { getCourses, getMyCourses } from "../../api.js";
import { FALLBACK_IMAGE } from "../Courses.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    Promise.all([getCourses(), getMyCourses()])
      .then(([allCourses, myCourses]) => {
        if (cancelled) return;
        setCourses(allCourses);
        setEnrolledIds(new Set(myCourses.map((e) => e.course.id)));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <>
      <div className="student__header">
        <p className="eyebrow">Home</p>
        <h1>Welcome back, {firstName}.</h1>
        <p className="student__lede">Pick up where you left off, or explore a new batch.</p>
      </div>

      <div className="student__quick-links">
        <Link to="/dashboard/courses" className="student__quick-link">
          <h3>My Courses</h3>
          <p>Continue learning from the batches you're already enrolled in.</p>
        </Link>
        <Link to="/dashboard/profile" className="student__quick-link">
          <h3>My Profile</h3>
          <p>Update your name, email, and profile photo.</p>
        </Link>
      </div>

      <h2 className="student__section-title">Our Courses</h2>

      {status === "loading" && <p className="state-message">Loading courses…</p>}
      {status === "error" && <p className="state-message">Couldn't load courses right now.</p>}

      {status === "ready" && (
        <div className="course-grid">
          {courses.map((course) => {
            const enrolled = enrolledIds.has(course.id);
            return (
              <article key={course.id} className="course-card">
                <img
                  className="course-card__image"
                  src={course.image || FALLBACK_IMAGE[course.stage] || "/course-foundation.svg"}
                  alt={course.title}
                />
                <div className="course-card__body">
                  <h3>{course.title}</h3>
                  <p className="course-card__summary">{course.summary}</p>
                  <p className="course-card__duration">{course.duration}</p>
                  <div className="course-card__action">
                    {enrolled ? (
                      <Link
                        to={`/dashboard/courses/${course.id}/learn`}
                        className="button button--primary button--sm"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <Link to={`/courses/${course.id}`} className="button button--primary button--sm">
                        Explore
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
