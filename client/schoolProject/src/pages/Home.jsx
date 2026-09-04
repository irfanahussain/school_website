import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../api.js";
import Reveal from "../components/Reveal.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";

const CATEGORIES = [
  {
    icon: "🧬",
    title: "NEET Coaching",
    body: "Biology, Physics and Chemistry mastery for future doctors, with weekly NCERT-based tests.",
  },
  {
    icon: "🧮",
    title: "JEE Main & Advanced",
    body: "Concept-first Physics, Chemistry and Maths, built around real JEE problem patterns.",
  },
  {
    icon: "📘",
    title: "Foundation Program",
    body: "Class 8-10 groundwork that builds reasoning skills early for future entrance exams.",
  },
  {
    icon: "🎯",
    title: "CUET & Board Combo",
    body: "Board exam strength paired with focused CUET practice for top university admissions.",
  },
];

const HIGHLIGHTS = [
  {
    icon: "👩‍🏫",
    title: "Mentors, not just teachers",
    body: "Every batch is led by subject-expert faculty who track each student's progress personally, not just the class average.",
  },
  {
    icon: "📊",
    title: "Weekly tests & analytics",
    body: "Structured test series with rank-wise performance reports so students and parents always know where they stand.",
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "Small, focused batches",
    body: "Batch sizes are kept small on purpose, so doubts get cleared in the room — not left for later.",
  },
];

const STATS = [
  { value: 12000, suffix: "+", label: "Students mentored" },
  { value: 850, suffix: "+", label: "Medical & engineering selections" },
  { value: 60, suffix: "+", label: "Expert faculty" },
  { value: 18, suffix: "", label: "Years of excellence" },
];

const TESTIMONIALS = [
  {
    quote:
      "The weekly test series and rank analysis kept me honest about where I stood. That discipline is the reason I cracked NEET on my first attempt.",
    name: "Anjali Menon",
    meta: "NEET 2025 · AIR 1,842",
  },
  {
    quote:
      "My JEE mentor didn't just teach formulas — he pushed me to think through problems the way the exam actually asks them.",
    name: "Rahul Nair",
    meta: "JEE Advanced 2025 · IIT Madras",
  },
  {
    quote:
      "Joining the Foundation batch in Class 9 gave me a two-year head start. By Class 11 I was already comfortable with JEE-level questions.",
    name: "Fathima Zahra",
    meta: "Foundation → JEE batch",
  },
];

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getCourses()
      .then((data) => {
        if (!cancelled) setCourses(data.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setCourses([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <p className="hero__eyebrow eyebrow">NEET · JEE · Foundation · CUET</p>
          <h1>Aim high. Achieve more. Learn with mentors who track every rank.</h1>
          <p className="hero__lede">
            Apex Learning Institute pairs concept-first teaching with weekly test analytics and
            small, focused batches — so students walk into exam day prepared, not just practiced.
          </p>
          <div className="hero__actions">
            <Link to="/courses" className="button button--primary">
              Explore Courses
            </Link>
            <Link to="/admissions" className="button button--ghost">
              Book a Free Demo Class
            </Link>
          </div>
          <div className="hero__trust">
            <div className="hero__trust-item">
              <span className="hero__trust-value">850+</span>
              <p className="hero__trust-label">Selections last year</p>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-value">18 yrs</span>
              <p className="hero__trust-label">Of coaching experience</p>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-value">60+</span>
              <p className="hero__trust-label">Expert mentors</p>
            </div>
          </div>
        </div>
        <div className="hero__panel" aria-hidden="true">
          <div className="hero__panel-grid">
            <span>🧬 NEET</span>
            <span>🧮 JEE Main</span>
            <span>⚙️ JEE Advanced</span>
            <span>📘 Foundation</span>
            <span>🎯 CUET</span>
            <span>🚀 Dropper Batch</span>
          </div>
          <div className="hero__floating-card">
            <span className="hero__floating-card-icon">🏆</span>
            <div>
              <span className="hero__floating-card-value">98% Result Rate</span>
              <p className="hero__floating-card-label">Across all batches, 2025</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section stats" style={{ paddingTop: "2.5rem" }}>
        <div className="stats__grid">
          {STATS.map((stat) => (
            <Reveal as="div" key={stat.label} className="stats__item">
              <span className="stats__value">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <p className="stats__label">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal as="div" className="section__head">
          <div>
            <p className="eyebrow">Programs</p>
            <h2 className="section__heading">Exam categories we coach for</h2>
          </div>
        </Reveal>
        <div className="categories">
          {CATEGORIES.map((cat, i) => (
            <Reveal as="article" key={cat.title} className="category-card" delay={i * 80}>
              <div className="category-card__icon" aria-hidden="true">
                {cat.icon}
              </div>
              <h3>{cat.title}</h3>
              <p>{cat.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {courses.length > 0 && (
        <section className="section">
          <Reveal as="div" className="section__head">
            <div>
              <p className="eyebrow">Popular batches</p>
              <h2 className="section__heading">Courses students are enrolling in</h2>
            </div>
            <Link to="/courses" className="button button--ghost button--sm">
              View all courses
            </Link>
          </Reveal>
          <div className="course-grid">
            {courses.map((course, i) => (
              <Reveal as="article" key={course.id} className="course-card" delay={i * 80}>
                <div className="course-card__icon" aria-hidden="true">
                  {course.icon || "🎓"}
                </div>
                <h3>{course.title}</h3>
                <p className="course-card__summary">{course.summary}</p>
                <p className="course-card__duration">{course.duration}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <Reveal as="div" className="section__head">
          <div>
            <p className="eyebrow">Why Apex</p>
            <h2 className="section__heading">Why families choose Apex Learning Institute</h2>
          </div>
        </Reveal>
        <div className="highlights">
          {HIGHLIGHTS.map((item, i) => (
            <Reveal as="article" key={item.title} className="highlights__card" delay={i * 80}>
              <div className="highlights__icon" aria-hidden="true">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal as="div" className="section__head">
          <div>
            <p className="eyebrow">Success stories</p>
            <h2 className="section__heading">What our students say</h2>
          </div>
        </Reveal>
        <div className="testimonials">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="article" key={t.name} className="testimonial-card" delay={i * 80}>
              <span className="testimonial-card__quote-mark" aria-hidden="true">
                "
              </span>
              <p className="testimonial-card__quote">{t.quote}</p>
              <div className="testimonial-card__person">
                <span className="testimonial-card__avatar">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <span className="testimonial-card__name">{t.name}</span>
                  <p className="testimonial-card__meta">{t.meta}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section cta-band">
        <div className="cta-band__inner">
          <div>
            <h2>Not sure which batch is right for you?</h2>
            <p>Book a free demo class and get a personalised study-plan recommendation.</p>
          </div>
          <div className="cta-band__actions">
            <Link to="/admissions" className="button button--primary">
              Book a Free Demo Class
            </Link>
            <Link to="/contact" className="button button--on-dark">
              Talk to a Counsellor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
