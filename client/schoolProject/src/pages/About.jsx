import Reveal from "../components/Reveal.jsx";

const VALUES = [
  {
    title: "Concept clarity over rote learning",
    body: "Every topic is taught to be understood, not memorised — because exam questions are built to catch memorisation, not understanding.",
  },
  {
    title: "Data-driven mentoring",
    body: "Weekly tests feed into a rank and performance dashboard, so mentors know exactly where each student needs support before it becomes a gap.",
  },
  {
    title: "A student, not a roll number",
    body: "Small batches mean faculty know each student's strengths, struggles, and target rank — advising is personal, not generic.",
  },
];

const FACULTY = [
  { name: "Dr. Suresh Kumar", role: "Director & Physics Mentor", subject: "20+ years, IIT alumnus" },
  { name: "Dr. Anita Varghese", role: "Head of Biology", subject: "NEET specialist, ex-CBSE examiner" },
  { name: "Vishnu Prasad", role: "Head of Mathematics", subject: "JEE Advanced specialist" },
  { name: "Meera Krishnan", role: "Head of Chemistry", subject: "Organic & Physical Chemistry" },
];

export default function About() {
  return (
    <>
      <section className="page-header">
        <p className="page-header__eyebrow eyebrow">About Softspire</p>
        <h1>Eighteen years of turning exam preparation into results.</h1>
        <p className="page-header__lede">
          Founded in 2007 by a group of IIT and medical-college alumni who wanted coaching built
          around understanding rather than drilling, Softspire Learning now mentors close to
          2,000 students a year across NEET, JEE, Foundation and CUET programs from our Kozhikode
          campus.
        </p>
      </section>

      <section className="section split">
        <Reveal as="div">
          <h2 className="section__heading">Our mission</h2>
          <p>
            We prepare students to think clearly under pressure and solve problems the way exams
            actually test them. That means concept-first teaching, weekly performance tracking,
            and mentors who stay close enough to catch a struggling student early.
          </p>
        </Reveal>
        <Reveal as="div" delay={100}>
          <h2 className="section__heading">Our campus</h2>
          <p>
            Our Kozhikode campus holds dedicated classrooms for NEET, JEE and Foundation batches,
            a physics and chemistry demonstration lab, a digital learning center for recorded
            revision sessions, and a full-time doubt-clearing desk open through the week.
          </p>
        </Reveal>
      </section>

      <section className="section">
        <Reveal as="div" className="section__head">
          <div>
            <p className="eyebrow">What we value</p>
            <h2 className="section__heading">The Softspire approach</h2>
          </div>
        </Reveal>
        <div className="highlights">
          {VALUES.map((item, i) => (
            <Reveal as="article" key={item.title} className="highlights__card" delay={i * 80}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal as="div" className="section__head">
          <div>
            <p className="eyebrow">Meet the mentors</p>
            <h2 className="section__heading">Faculty who've walked the path</h2>
          </div>
        </Reveal>
        <div className="leadership">
          {FACULTY.map((person, i) => (
            <Reveal as="div" key={person.name} className="leadership__card" delay={i * 80}>
              <span className="leadership__avatar" aria-hidden="true">
                {person.name
                  .split(" ")
                  .filter((w) => w !== "Dr.")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="leadership__name">{person.name}</span>
              <span className="leadership__role">{person.role}</span>
              <p className="leadership__subject">{person.subject}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
