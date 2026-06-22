import { useCallback } from "react";
import {
  Github, Linkedin, Youtube, FileDown, Mail, MapPin, Sparkles,
  ArrowUpRight, GraduationCap, Briefcase, Wrench, MessageSquare
} from "lucide-react";
import content from "./content.json";
import Chat from "./Chat.jsx";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function downloadResume() {
  const a = document.createElement("a");
  a.href = content.resumePath;
  a.download = "Saket_Mundhada_FDE_resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function openAsk() {
  window.dispatchEvent(new Event("open-ask-saket"));
}

function Nav() {
  return (
    <nav className="nav">
      <button className="nav-brand" onClick={() => scrollToId("hero")}>SM</button>
      <div className="nav-links">
        <button onClick={() => scrollToId("projects")}>Projects</button>
        <button onClick={() => scrollToId("experience")}>Experience</button>
        <button onClick={() => scrollToId("skills")}>Skills</button>
        <button onClick={() => scrollToId("contact")}>Contact</button>
        <button className="btn btn-sm" onClick={openAsk}><Sparkles size={15} /> Ask Saket</button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header id="hero" className="hero">
      <p className="hero-eyebrow">{content.lookingFor}</p>
      <h1 className="hero-name">{content.name}</h1>
      <p className="hero-tagline">{content.tagline}</p>
      <p className="hero-meta"><MapPin size={15} /> {content.location} &nbsp;·&nbsp; {content.email}</p>
      <div className="hero-cta">
        <button className="btn btn-primary" onClick={openAsk}><MessageSquare size={17} /> Ask the AI about me</button>
        <button className="btn" onClick={downloadResume}><FileDown size={17} /> Download resume</button>
      </div>
      <div className="hero-links">
        <a href={content.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
        <a href={content.links.github} target="_blank" rel="noreferrer"><Github size={18} /></a>
        <a href={content.links.webgpt} target="_blank" rel="noreferrer">WebGPT <ArrowUpRight size={14} /></a>
        <a href={content.links.youtube} target="_blank" rel="noreferrer"><Youtube size={18} /> Demo</a>
      </div>
      <p className="hero-hint">Tip: paste a job description into the assistant and it'll tell you why I fit.</p>
    </header>
  );
}

function SectionTitle({ icon, children }) {
  return <h2 className="section-title">{icon}<span>{children}</span></h2>;
}

function Projects() {
  return (
    <section id="projects" className="section">
      <SectionTitle icon={<Sparkles size={20} />}>Projects</SectionTitle>
      <div className="projects">
        {content.projects.map((p) => (
          <article key={p.slug} id={`project-${p.slug}`} className="card">
            <h3 className="card-title">{p.title}</h3>
            <p className="card-stack">{p.stack}</p>
            <p className="card-summary">{p.summary}</p>
            <ul className="card-bullets">
              {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            {p.slug === "webgpt" && (
              <div className="card-links">
                <a href={content.links.webgpt} target="_blank" rel="noreferrer">Code <ArrowUpRight size={14} /></a>
                <a href={content.links.youtube} target="_blank" rel="noreferrer">Demo <ArrowUpRight size={14} /></a>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="section">
      <SectionTitle icon={<Briefcase size={20} />}>Experience</SectionTitle>
      {content.experience.map((job, i) => (
        <div key={i} className="job">
          <div className="job-head">
            <h3>{job.company} <span className="job-role">— {job.role}</span></h3>
            <span className="job-dates">{job.dates}</span>
          </div>
          <ul className="card-bullets">
            {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
          </ul>
        </div>
      ))}
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section">
      <SectionTitle icon={<Wrench size={20} />}>Skills</SectionTitle>
      <div className="skills">
        {Object.entries(content.skills).map(([key, val]) => (
          <div key={key} className="skill-row">
            <div className="skill-key">{key}</div>
            <div className="skill-val">{val}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="section">
      <SectionTitle icon={<GraduationCap size={20} />}>Education</SectionTitle>
      {content.education.map((e, i) => (
        <div key={i} className="edu">
          <h3>{e.school}</h3>
          <p className="edu-degree">{e.degree}</p>
          <p className="edu-meta">{e.meta}</p>
        </div>
      ))}
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section contact">
      <SectionTitle icon={<Mail size={20} />}>Get in touch</SectionTitle>
      <p>Hiring for a Forward Deployed or Applied AI role? The fastest path is to ask the assistant — or reach me directly.</p>
      <div className="hero-cta">
        <a className="btn btn-primary" href={`mailto:${content.email}`}><Mail size={17} /> {content.email}</a>
        <button className="btn" onClick={openAsk}><MessageSquare size={17} /> Ask the assistant</button>
      </div>
      <div className="hero-links">
        <a href={content.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>
        <a href={content.links.github} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="footer">© {new Date().getFullYear()} {content.name} · Built with an AI agent that knows my resume.</footer>;
}

export default function App() {
  const runActions = useCallback((actions = []) => {
    for (const act of actions) {
      if (act.type === "scroll_to") {
        scrollToId(act.section);
      } else if (act.type === "show_project") {
        const id = `project-${act.slug}`;
        scrollToId(id);
        const el = document.getElementById(id);
        if (el) {
          el.classList.add("flash");
          setTimeout(() => el.classList.remove("flash"), 1600);
        }
      } else if (act.type === "download_resume") {
        downloadResume();
      } else if (act.type === "open_booking") {
        if (content.bookingUrl) window.open(content.bookingUrl, "_blank", "noreferrer");
        else scrollToId("contact");
      }
    }
  }, []);

  return (
    <>
      <Nav />
      <main className="container">
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Chat onActions={runActions} />
    </>
  );
}
