import { motion } from "framer-motion";
import { PROFILE, STATS, SKILLS, EXPERIENCE, PROJECTS, SERVICES, TESTIMONIALS } from "@/lib/portfolio-data";
import { FiStar, FiGithub, FiLinkedin, FiMail, FiMapPin, FiExternalLink, FiDownload } from "react-icons/fi";
import type { ReactNode  } from "react";
import {useRef} from "react";
import emailjs from "@emailjs/browser";
import ResumePDF from "@/assets/Bushra Aman.pdf";

function PageFrame({
  chapter,
  title,
  children,
  side = "right",
}: {
  chapter?: string;
  title?: string;
  children: ReactNode;
  side?: "left" | "right";
}) {
  return (
    <div className="flex h-full w-full flex-col">
      {(chapter || title) && (
        <header className={side === "right" ? "text-right" : "text-left"}>
          {chapter && (
            <p className="text-[10px] tracking-[0.4em] text-cyan uppercase">{chapter}</p>
          )}
          {title && (
            <h2 className="font-display mt-2 text-3xl leading-none text-[#1a1a1a] md:text-4xl">
              {title}
            </h2>
          )}
        </header>
      )}
      <div className="mt-6 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">{children}</div>
    </div>
  );
}

/* ---------- Individual page contents ---------- */

export function CoverFront({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.25),transparent_60%)]" />
      <p className="text-[10px] tracking-[0.5em] text-cyan/90 uppercase">Portfolio · Vol I</p>
      <div className="my-6 h-px w-16 bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
      <h1 className="font-display text-glow text-4xl leading-tight text-white md:text-6xl">
        {PROFILE.name}
      </h1>
      <p className="mt-4 text-sm tracking-[0.25em] text-white/60 uppercase">
        {PROFILE.role}
      </p>
      <p className="mt-6 max-w-xs text-sm text-white/50 italic">"{PROFILE.tagline}"</p>

      <motion.button
        onClick={onOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="btn-glow relative mt-10 rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8] px-6 py-2.5 text-xs font-semibold tracking-widest text-white uppercase"
      >
        Open Portfolio
      </motion.button>

      <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between text-[9px] tracking-[0.3em] text-white/40 uppercase">
        {/* <span>MMXXVI</span>
        <span>Lisbon · Remote</span> */}
      </div>
    </div>
  );
}

export function TableOfContents({ chapters, onGo }: { chapters: string[]; onGo: (i: number) => void }) {
  return (
    <PageFrame chapter="Contents" title="Table of Contents" side="left">
      <ul className="divide-y divide-black/10">
        {chapters.map((c, i) => (
          <li key={c}>
            <button
              onClick={() => onGo(i)}
              className="group flex w-full items-center justify-between py-3 text-left transition"
            >
              <span className="text-sm tracking-wide text-[#1a1a1a] group-hover:text-[#2563eb]">
                {String(i + 1).padStart(2, "0")} · {c}
              </span>
              <span className="text-[10px] tracking-widest text-neutral-500 uppercase">
                p.{String(i + 2).padStart(2, "0")}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}

export function About() {
  return (
    <PageFrame chapter="Chapter 01" title="About the author" side="left">
      <p className="max-w-md text-[13px] leading-relaxed text-neutral-700">
        I'm {PROFILE.name}, a Frontend Web & App Developer passionate about building modern, responsive, and user-friendly web and mobile applications. I specialize in React, React Native, TypeScript, Tailwind CSS, and transforming Figma designs into production-ready interfaces. 
      </p>
      <p className="mt-3 max-w-md text-[13px] leading-relaxed text-neutral-700">
        I enjoy creating clean, scalable, and high-performance digital experiences that combine intuitive design with efficient code. My goal is to develop impactful applications that solve real-world problems and deliver an exceptional user experience.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
            <div className="font-display text-2xl text-[#1a1a1a]">{s.value}</div>
            <div className="mt-0.5 text-[10px] tracking-widest text-neutral-500 uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}

export function Skills() {
  return (
    <PageFrame chapter="Chapter 02" title="Toolkit">
      <div className="grid gap-5 md:grid-cols-1">
        {SKILLS.map((cat) => (
          <div key={cat.category}>
            <h3 className="text-[10px] tracking-[0.35em] text-[#2563eb] uppercase">
              {cat.category}
            </h3>
            <ul className="mt-2 space-y-2">
              {cat.items.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.name}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="flex items-center gap-2 text-[#1a1a1a]">
                        <Icon className="text-[#2563eb]" /> {s.name}
                      </span>
                      <span className="text-neutral-500">{s.level}%</span>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-full bg-black/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.level}%` }}
                        transition={{ duration: 0.9 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8]"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}

export function Experience() {
  return (
    <PageFrame chapter="Chapter 03" title="Experience" side="left">
      <div className="relative">
        <div className="absolute top-1 bottom-1 left-2 w-px bg-gradient-to-b from-[#2563eb]/60 via-[#38bdf8]/40 to-transparent" />
        <ul className="space-y-4">
          {EXPERIENCE.map((e) => (
            <li key={e.year + e.role} className="relative pl-8">
              <span className="absolute top-1.5 left-[3px] h-2.5 w-2.5 rounded-full bg-[#2563eb] shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
              <div className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
                {e.year}
              </div>
              <div className="text-sm text-[#1a1a1a]">
                {e.role} · <span className="text-[#2563eb]">{e.company}</span>
              </div>
              <p className="mt-0.5 text-[12px] leading-snug text-neutral-600">{e.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}

export function ProjectsIntro() {
  return (
    <PageFrame chapter="Chapter 04" title="Selected projects">
      <p className="max-w-sm text-[13px] leading-relaxed text-neutral-700">
        A small selection of work I'm proud of — from 3D configurators and analytics
        dashboards to editorial platforms and mobile fintech.
      </p>
      <div className="mt-6 space-y-3">
        {PROJECTS.slice(0, 2).map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>
    </PageFrame>
  );
}

export function ProjectsMore() {
  return (
    <PageFrame chapter="Chapter 04" title="More work" side="left">
      <div className="space-y-3">
        {PROJECTS.slice(2).map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>
    </PageFrame>
  );
}

function ProjectCard({ p }: { p: (typeof PROJECTS)[number] }) {
  return (
    <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3 transition hover:border-[#2563eb]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm text-[#1a1a1a]">{p.title}</div>
          <p className="mt-1 text-[11px] leading-snug text-neutral-600">{p.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {p.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/10 px-1.5 py-0.5 text-[9px] tracking-wider text-neutral-500 uppercase"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <a
          href="#"
          className="rounded-full border border-black/10 p-1.5 text-neutral-500 transition hover:border-[#2563eb] hover:text-[#2563eb]"
          aria-label={`Open ${p.title}`}
        >
          <FiExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <PageFrame chapter="Chapter 05" title="Services">
      <div className="grid gap-2.5">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-black/10 bg-black/[0.02] p-3 transition hover:border-[#2563eb]/50"
          >
            <div className="text-sm text-[#1a1a1a]">{s.title}</div>
            <div className="mt-0.5 text-[11px] text-neutral-600">{s.detail}</div>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}

export function Testimonials() {
  return (
    <PageFrame chapter="Chapter 06" title="Kind words" side="left">
      <div className="space-y-3">
        {TESTIMONIALS.map((t) => (
          <blockquote
            key={t.name}
            className="rounded-xl border border-black/10 bg-black/[0.02] p-3"
          >
            <div className="mb-1 flex gap-0.5 text-[#38bdf8]">
              {Array.from({ length: 5 }).map((_, k) => (
                <FiStar key={k} className="fill-[#38bdf8]" size={11} />
              ))}
            </div>
            <p className="text-[12px] leading-snug text-[#1a1a1a] italic">"{t.quote}"</p>
            <footer className="mt-1.5 text-[10px] tracking-wider text-neutral-500 uppercase">
              {t.name} — {t.title}
            </footer>
          </blockquote>
        ))}
      </div>
    </PageFrame>
  );
}

export function Resume() {
  return (
    <PageFrame chapter="Chapter 07" title="Résumé">
      <p className="text-[13px] leading-relaxed text-neutral-700">
        A concise one-page CV covering my experience, skills, and selected projects. Available
        as a printable PDF.
      </p>
      <div className="mt-5 rounded-xl border border-black/10 bg-black/[0.02] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">Preview</span>
         <a
          href={ResumePDF}
          download="Bushra Aman.pdf"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] px-3 py-1.5 text-[10px] tracking-widest text-white uppercase transition hover:bg-[#2563eb]"
>
  <FiDownload size={11} />
  Download PDF
</a>
        </div>
        <div className="space-y-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full bg-black/10"
              style={{ width: `${60 + ((i * 17) % 40)}%` }}
            />
          ))}
        </div>
      </div>
    </PageFrame>
  );
}


export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs
      .sendForm(
        "service_e02veox", // Replace with your Service ID
        "template_w4bd337", // Replace with your Template ID
        formRef.current,
        "O8Ov3cXRxZ5_T733t" // Replace with your Public Key
      )
      .then(() => {
        alert("Message sent successfully!");
        formRef.current?.reset();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to send message.");
      });
  };

  return (
    <PageFrame chapter="Epilogue" title="Let's talk" side="left">
      <p className="max-w-sm text-[13px] leading-relaxed text-neutral-700">
        Let's build something amazing together. I'm open to frontend,
        React Native, and freelance opportunities, with responses
        typically within 24 hours.
      </p>

      <ul className="mt-4 space-y-1.5 text-[12px] text-[#1a1a1a]">
        <li className="flex items-center gap-2">
          <FiMail className="text-[#2563eb]" />
          {PROFILE.email}
        </li>

        <li className="flex items-center gap-2">
          <FiMapPin className="text-[#2563eb]" />
          {PROFILE.location}
        </li>
      </ul>

      <div className="mt-4 flex gap-2">
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/10 p-2.5 text-black transition hover:border-[#2563eb] hover:text-[#2563eb]"
        >
          <FiGithub size={14} />
        </a>

        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/10 p-2.5 text-black transition hover:border-[#2563eb] hover:text-[#2563eb]"
        >
          <FiLinkedin size={14} />
        </a>
      </div>

      <form
        ref={formRef}
        onSubmit={sendEmail}
        className="mt-5 space-y-2 rounded-xl border border-black/10 bg-black/[0.02] p-3"
      >
        <input
          type="text"
          name="user_name"
          placeholder="Your Name"
          required
          className="w-full rounded-md border border-black/10 bg-white text-black placeholder:text-gray-400 px-2.5 py-1.5 text-[12px] outline-none focus:border-[#2563eb]"
        />

        <input
          type="email"
          name="user_email"
          placeholder="Your Email"
          required
          className="w-full rounded-md border border-black/10 bg-white text-black placeholder:text-gray-400 px-2.5 py-1.5 text-[12px] outline-none focus:border-[#2563eb]"
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows={4}
          required
          className="w-full rounded-md border border-black/10 bg-white text-black placeholder:text-gray-400 px-2.5 py-1.5 text-[12px] outline-none focus:border-[#2563eb]"
        />

        <button
          type="submit"
          className="w-full rounded-md bg-[#1a1a1a] py-2 text-[11px] tracking-widest text-white uppercase transition hover:bg-[#2563eb]"
        >
          Send Message
        </button>
      </form>
    </PageFrame>
  );
}

export function BackCover() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <p className="text-[10px] tracking-[0.5em] text-cyan/80 uppercase">Fin</p>
      <div className="my-4 h-px w-16 bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
      <p className="max-w-xs text-sm text-white/70">
        Thanks for reading. Every interaction shipped with care.
      </p>
      <p className="mt-6 font-display text-2xl text-white">{PROFILE.name}</p>
      <p className="mt-1 text-[10px] tracking-[0.35em] text-white/40 uppercase">
        {PROFILE.role}
      </p>
    </div>
  );
}
