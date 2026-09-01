import { Link } from "react-router-dom";

const HIGHLIGHTS = [
  {
    title: "Small classes, close attention",
    body: "Our average class holds 16 students, so every teacher knows exactly where each child needs support or a push.",
  },
  {
    title: "A campus built for exploring",
    body: "Science labs, a working garden, a black-box theater, and 40 acres of trails sit right outside the classroom door.",
  },
  {
    title: "Grounded in the fundamentals",
    body: "Strong reading, writing, and math instruction underpin every grade, alongside art, music, and outdoor education.",
  },
];

const STATS = [
  { value: "1998", label: "Founded in" },
  { value: "16:1", label: "Student-teacher ratio" },
  { value: "94%", label: "Graduates pursue higher education" },
  { value: "500+", label: "Students, KG to Grade 12" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <p className="hero__eyebrow">Kindergarten through Grade 12</p>
          <h1>
            A school where curious kids become confident thinkers.
          </h1>
          <p className="hero__lede">
            Lemer Public School pairs a rigorous academic core with hands-on studios, athletics,
            and a campus built for wandering — so students leave ready for what's next, not just
            what's on the test.
          </p>
          <div className="hero__actions">
            <Link to="/admissions" className="button button--primary">
              Start an application
            </Link>
            <Link to="/about" className="button button--ghost">
              Learn about us
            </Link>
          </div>
        </div>
        <div className="hero__panel" aria-hidden="true">
          <div className="hero__panel-grid">
            <span>Reading</span>
            <span>Mathematics</span>
            <span>Science Lab</span>
            <span>Studio Art</span>
            <span>World Languages</span>
            <span>Athletics</span>
          </div>
        </div>
      </section>

      <section className="section stats">
        <div className="stats__grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="stats__item">
              <span className="stats__value">{stat.value}</span>
              <span className="stats__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__heading">Why families choose Lemer</h2>
        <div className="highlights">
          {HIGHLIGHTS.map((item) => (
            <article key={item.title} className="highlights__card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta-band">
        <div className="cta-band__inner">
          <div>
            <h2>Visit our campus this fall</h2>
            <p>Tour classrooms, meet faculty, and see a typical day in session.</p>
          </div>
          <Link to="/contact" className="button button--primary">
            Schedule a visit
          </Link>
        </div>
      </section>
    </>
  );
}
