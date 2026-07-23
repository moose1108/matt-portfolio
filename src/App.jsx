import { HashRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import StationRoulette from "./components/StationRoulette";
import "./theme.css";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionLink({ id, children, className }) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      requestAnimationFrame(() => {
        setTimeout(() => scrollToId(id), 50);
      });
      return;
    }
    scrollToId(id);
  };

  return (
    <a className={className} href={`#${id}`} onClick={go}>
      {children}
    </a>
  );
}

const EXPERIENCE = [
  {
    role: "Machine Learning Engineer Intern",
    org: "Philo Homes",
    place: "USA · Remote",
    when: "Jun 2026 – Sep 2026",
  },
  {
    role: "Research Assistant",
    org: "National Taiwan University",
    place: "Taipei, Taiwan",
    when: "Aug 2024 – Feb 2025",
  },
  {
    role: "Software Engineer Intern",
    org: "WeatherRisk Explore Inc.",
    place: "Taipei, Taiwan",
    when: "Mar 2024 – Jul 2024",
  },
  {
    role: "Undergraduate Researcher",
    org: "Trustworthy AI Dialog Engine · iAgentsLab",
    place: "Taipei, Taiwan",
    when: "Oct 2023 – Jul 2024",
  },
];

const PROJECTS = [
  {
    title: "RapidFire RAG System",
    tag: "Spring 2026",
    href: "https://github.com/moose1108",
  },
  {
    title: "GridDebugAgent",
    tag: "Winter 2026",
    href: "https://arxiv.org/pdf/2607.18147",
    linkLabel: "View paper →",
  },
  {
    title: "Regional Climate Downscaling",
    tag: "NTU Research",
    href: "https://github.com/moose1108/RCM-downscaling-in-DL",
  },
  {
    title: "LLM Safety Evaluation (Traditional Chinese)",
    tag: "iAgentsLab",
    href: "https://github.com/moose1108/safety_evaluation_LLM",
  },
];

const SKILLS = [
  {
    title: "Languages",
    items: ["Python", "C", "C++", "JavaScript", "SQL", "Shell", "Golang"],
  },
  {
    title: "Web",
    items: ["React", "Node.js / Express", "Vite", "MongoDB", "GraphQL", "Flask", "REST APIs"],
  },
  {
    title: "ML / AI",
    items: ["PyTorch", "TensorFlow", "Hugging Face", "scikit-learn", "RAG", "LoRA", "LLM Evaluation"],
  },
  {
    title: "Spoken",
    items: ["Mandarin (Native)", "English (Proficient)", "Spanish (Intermediate)"],
  },
];

function Home() {
  return (
    <main>
      <section className="hero container" aria-label="Introduction">
        <p className="mono hero-kicker">Meng-Chi (Matt) Tsai</p>
        <h1 className="h1">
          Building ML systems
          <br />
          for the real world.
        </h1>
        <p className="lede">
          M.S. ECE — Machine Learning & Data Science at UC San Diego.
          Previously CS at NTU, with work spanning climate ML, agentic systems, and LLM safety.
        </p>
        <div className="hero-actions">
          <SectionLink className="btn primary" id="experience">
            View experience
          </SectionLink>
          <a className="btn" href="mailto:moosethegrad@gmail.com">
            Email
          </a>
          <a
            className="btn"
            href="https://github.com/moose1108"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </section>

      <section id="experience" className="section container">
        <div className="section-head">
          <p className="mono">Experience</p>
          <h2 className="h2">Where I’ve built and researched</h2>
        </div>
        <div className="timeline">
          {EXPERIENCE.map((job) => (
            <article key={`${job.org}-${job.when}`} className="exp-item">
              <div className="exp-meta">
                <div className="when">{job.when}</div>
                <div>{job.place}</div>
              </div>
              <div>
                <h3 className="exp-title">{job.role}</h3>
                <p className="exp-org">{job.org}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section container">
        <div className="section-head">
          <p className="mono">Projects</p>
          <h2 className="h2">Selected systems & research</h2>
        </div>
        <div className="project-list">
          {PROJECTS.map((p) => (
            <article key={p.title} className="project">
              <div className="project-top">
                <h3 className="project-title">{p.title}</h3>
                <span className="project-tag">{p.tag}</span>
              </div>
              {p.href && (
                <a className="project-link" href={p.href} target="_blank" rel="noreferrer">
                  {p.linkLabel || "View on GitHub →"}
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="section container">
        <div className="section-head">
          <p className="mono">About</p>
          <h2 className="h2">Education & skills</h2>
        </div>
        <div className="split">
          <div>
            <article className="edu-item">
              <div className="when">Sep 2025 – Jun 2027</div>
              <h3>M.S. Electrical & Computer Engineering</h3>
              <p className="place">UC San Diego · Machine Learning & Data Science · La Jolla, CA</p>
            </article>
            <article className="edu-item">
              <div className="when">Sep 2020 – Jun 2024</div>
              <h3>B.S. Computer Science & Information Engineering</h3>
              <p className="place">National Taiwan University · Minor in Atmospheric Science · Taipei</p>
            </article>
          </div>
          <div>
            {SKILLS.map((group) => (
              <div key={group.title} className="skill-group">
                <h3>{group.title}</h3>
                <div className="skill-tags">
                  {group.items.map((item) => (
                    <span key={item} className="skill-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-strip container">
        <div>
          <p className="mono">Contact</p>
          <h2 className="h2">Let’s talk</h2>
          <p className="lede">Open to research collabs, internships, and ML systems work.</p>
        </div>
        <div className="contact-row">
          <a className="btn primary" href="mailto:moosethegrad@gmail.com">
            moosethegrad@gmail.com
          </a>
          <a className="btn" href="https://github.com/moose1108" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            className="btn"
            href="https://www.instagram.com/moose_the_guide/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="site">
      <div className="site-bg" aria-hidden="true" />
      <HashRouter>
        <header className="site-header">
          <div className="container nav-bar">
            <Link className="brand" to="/">
              Matt<span>.</span>Tsai
            </Link>
            <nav className="nav-links" aria-label="Primary">
              <Link className="nav-link" to="/">
                Home
              </Link>
              <SectionLink className="nav-link" id="experience">
                Experience
              </SectionLink>
              <SectionLink className="nav-link" id="projects">
                Projects
              </SectionLink>
              <Link className="nav-link" to="/roulette">
                Roulette
              </Link>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roulette" element={<StationRoulette />} />
          <Route path="/MRT" element={<Navigate to="/roulette" replace />} />
        </Routes>

        <footer className="container site-footer">
          © {new Date().getFullYear()} Meng-Chi (Matt) Tsai · Built with React & Vite
        </footer>
      </HashRouter>
    </div>
  );
}
