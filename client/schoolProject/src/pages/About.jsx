const VALUES = [
  {
    title: "Rigor with warmth",
    body: "High expectations are paired with real relationships — teachers know students by name, strength, and struggle.",
  },
  {
    title: "Learning by doing",
    body: "Labs, studios, the garden, and the stage are where lessons get tested, not just where periods are spent.",
  },
  {
    title: "A whole child, not a transcript",
    body: "Advising, athletics, and the arts are treated as core to a Lemer education, not extras bolted onto it.",
  },
];

const LEADERSHIP = [
  { name: "Dr. Elena Marsh", role: "Head of School" },
  { name: "James Okafor", role: "Dean of Academics" },
  { name: "Priya Ramaswami", role: "Director of Admissions" },
  { name: "Tom Whitfield", role: "Dean of Students" },
];

export default function About() {
  return (
    <>
      <section className="page-header">
        <p className="page-header__eyebrow">About Lemer</p>
        <h1>Nearly fifty years of educating the whole student.</h1>
        <p className="page-header__lede">
          Founded in 1998 by a small group of teachers who wanted a school built around
          curiosity rather than compliance, Lemer Public School now serves close to 500 students
          from Kindergarten through Grade 12 in Triprayar, Thrissur.
        </p>
      </section>

      <section className="section split">
        <div>
          <h2 className="section__heading">Our mission</h2>
          <p>
            We prepare students to think clearly, work hard, and treat other people well. That
            means a demanding academic core, taught by faculty who stay long enough to become
            mentors, inside a community small enough that no student goes unnoticed.
          </p>
        </div>
        <div>
          <h2 className="section__heading">Our campus</h2>
          <p>
            Our Triprayar campus holds six academic buildings, two science labs, a hall for
            performing arts, athletic fields, and open grounds used daily for outdoor
            education across every grade.
          </p>
        </div>
      </section>

      <section className="section">
        <h2 className="section__heading">What we value</h2>
        <div className="highlights">
          {VALUES.map((item) => (
            <article key={item.title} className="highlights__card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__heading">School leadership</h2>
        <div className="leadership">
          {LEADERSHIP.map((person) => (
            <div key={person.name} className="leadership__card">
              <span className="leadership__name">{person.name}</span>
              <span className="leadership__role">{person.role}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
