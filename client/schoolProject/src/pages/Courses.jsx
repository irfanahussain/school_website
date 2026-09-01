import { useEffect, useState } from "react";
import { getCourses } from "../api.js";

const STAGES = [
  { value: "", label: "All grades" },
  { value: "primary", label: "Primary" },
  { value: "middle", label: "Middle School" },
  { value: "high", label: "High School" },
];

export default function Courses() {
  const [stage, setStage] = useState("");
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getCourses(stage)
      .then((data) => {
        if (cancelled) return;
        setCourses(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [stage]);

  return (
    <>
      <section className="page-header">
        <p className="page-header__eyebrow">Academics</p>
        <h1>Courses across every grade.</h1>
        <p className="page-header__lede">
          A shared academic core runs from Kindergarten through Grade 12, building in depth and
          independence as students move through each division.
        </p>
      </section>

      <section className="section">
        <div className="tabs" role="tablist" aria-label="Filter courses by grade band">
          {STAGES.map((s) => (
            <button
              key={s.value || "all"}
              role="tab"
              aria-selected={stage === s.value}
              className={"tabs__button" + (stage === s.value ? " tabs__button--active" : "")}
              onClick={() => setStage(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {status === "loading" && <p className="state-message">Loading courses…</p>}

        {status === "error" && (
          <p className="state-message state-message--error">
            We couldn't reach the course catalog right now. Please check that the backend API is
            running, or try again shortly.
          </p>
        )}

        {status === "ready" && courses.length === 0 && (
          <p className="state-message">No courses found for this grade band yet.</p>
        )}

        {status === "ready" && courses.length > 0 && (
          <div className="course-grid">
            {courses.map((course) => (
              <article key={course.id} className="course-card">
                <div className="course-card__icon" aria-hidden="true">
                  {course.icon || "🎓"}
                </div>
                <h3>{course.title}</h3>
                <p className="course-card__summary">{course.summary}</p>
                <p className="course-card__description">{course.description}</p>
                <p className="course-card__duration">{course.duration}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
