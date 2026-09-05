import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCourses } from "../api.js";
import Reveal from "../components/Reveal.jsx";

const STAGES = [
  { value: "", label: "All programs" },
  { value: "primary", label: "Foundation (8-10)" },
  { value: "middle", label: "Class 11 & 12" },
  { value: "high", label: "Competitive & Dropper" },
];
const STAGE_VALUES = STAGES.map((s) => s.value);

export const FALLBACK_IMAGE = {
  primary: "/course-foundation.svg",
  middle: "/course-middle.svg",
  high: "/course-high.svg",
};

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStage = STAGE_VALUES.includes(searchParams.get("stage"))
    ? searchParams.get("stage")
    : "";
  const [stage, setStage] = useState(initialStage);
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");

  function selectStage(value) {
    setStage(value);
    setSearchParams(value ? { stage: value } : {}, { replace: true });
  }

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
        <p className="page-header__eyebrow eyebrow">Academics</p>
        <h1>Courses built around real exam patterns.</h1>
        <p className="page-header__lede">
          From early Foundation batches to intensive Dropper programs, every course is anchored
          in weekly testing, rank tracking, and mentors who specialise in that exact stage.
        </p>
      </section>

      <section className="section">
        <div className="tabs" role="tablist" aria-label="Filter courses by program stage">
          {STAGES.map((s) => (
            <button
              key={s.value || "all"}
              role="tab"
              aria-selected={stage === s.value}
              className={"tabs__button" + (stage === s.value ? " tabs__button--active" : "")}
              onClick={() => selectStage(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {status === "loading" && <p className="state-message">Loading courses…</p>}

        {status === "error" && (
  <p className="state-message state-message--error">
    We couldn't load the course catalog right now. Please try again shortly.
  </p>
)}

        {status === "ready" && courses.length === 0 && (
          <p className="state-message">No courses found for this category yet.</p>
        )}

        {status === "ready" && courses.length > 0 && (
          <div className="course-grid">
            {courses.map((course, i) => (
              <Reveal as="article" key={course.id} className="course-card" delay={(i % 3) * 80}>
                <img
                  className="course-card__image"
                  src={course.image || FALLBACK_IMAGE[course.stage] || "/course-foundation.svg"}
                  alt={course.title}
                />
                <div className="course-card__body">
                  <h3>{course.title}</h3>
                  <p className="course-card__summary">{course.summary}</p>
                  <p className="course-card__duration">{course.duration}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
