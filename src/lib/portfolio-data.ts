import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiThreedotjs,
  SiFramer,
  SiNodedotjs,
  SiPostgresql,
  SiFigma,
  SiGraphql,
} from "react-icons/si";
import type { IconType } from "react-icons";

export const PROFILE = {
  name: "Bushra Aman",
  role: " Frontend Web & App Developer",
  tagline: "Crafting cinematic, high-performance web experiences.",
  location: "Mingora, Pakistan",
  email: "bushraaman176@gmail.com",
  github: "https://github.com/bushraaman176",
  linkedin: "https://www.linkedin.com/in/bushra-aman-b1ab50313",
};

export const STATS = [
  { label: "Months of experience", value: "6+" },
  { label: "Projects shipped", value: "10+" },
  { label: "Happy clients", value: "10+" },
  { label: "Technologies", value: "10+" },
];

export type Skill = { name: string; level: number; icon: IconType };
export const SKILLS: { category: string; items: Skill[] }[] = [
  {
    category: "Frontend",
    items: [
      { name: "React / React Native", level: 96, icon: SiReact },
      { name: "TypeScript", level: 94, icon: SiTypescript },
      { name: "Tailwind CSS", level: 92, icon: SiTailwindcss },
      { name: "Three.js / R3F", level: 85, icon: SiThreedotjs },
    ],
  },
  {
    category: "Motion & Design",
    items: [
      
      { name: "Figma", level: 82, icon: SiFigma },
      { name: "Next.js", level: 88, icon: SiNextdotjs },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 84, icon: SiNodedotjs },
      { name: "MongoDB", level: 78, icon: SiPostgresql },
      { name: "Firebase", level: 80, icon: SiGraphql },
      { name: "API Integration", level: 80, icon: SiGraphql },
    ],
  },
];

export const EXPERIENCE = [
  {
    year: "June 2025 -Nov 2025 ",
    role: "App Developer",
    company: "Quantum Lab Ai",
    detail:
      "Passionate App Developer specializing in building modern, responsive, and high-performance mobile applications with intuitive user experiences.",
  },
  // {
  //   year: "2021 — 2023",
  //   role: "Senior React Developer",
  //   company: "Halcyon Labs",
  //   detail:
  //     "Shipped a SaaS analytics platform used by 40k+ teams. Owned design system and performance budget.",
  // },
  // {
  //   year: "2019 — 2021",
  //   role: "Frontend Developer",
  //   company: "Freelance",
  //   detail:
  //     "Delivered 20+ client sites focused on 3D, storytelling and interactive brand experiences.",
  // },
  // {
  //   year: "2017 — 2019",
  //   role: "Junior Developer",
  //   company: "Bright Pixel",
  //   detail:
  //     "Learned the craft — components, accessibility, and performance from the ground up.",
  // },
];

export const PROJECTS = [
  {
    title: "Ai Based Personalized SkinCare Advisor",
    description:
      "Personalized AI skincare platform offering skin analysis, product recommendations, and daily skincare guidance.",
    tech: ["React", "Python", "MongoDB", "API Integration"],
    gradient: "from-indigo-500/40 to-cyan-400/30",
  },
  {
    title: "Ai Clo Generator",
    description:
      "AI-based CLO generator that simplifies outcome-based education by producing accurate and measurable learning outcomes.",
    tech: ["React", "TypeScript", "Python", "API Integration"],
    gradient: "from-blue-500/40 to-violet-500/30",
  },
  {
    title: "Job Finder",
    description:
      "A modern job search platform that helps users discover, filter, and save job opportunities with an intuitive and responsive interface.",
    tech: ["React", "Framer Motion", "API Integration"],
    gradient: "from-sky-400/40 to-emerald-400/30",
  },
  {
    title: "Tasbeeh Counter App",
    description:
      "A digital Tasbeeh app that helps users count and manage their daily prayers and dhikr.",
    tech: ["React Native ", "TypeScript", "Tailwind CSS"],
    gradient: "from-fuchsia-500/40 to-blue-500/30",
  },
  {
    title: "Real Time Chat ",
    description:
      "A real-time chat application that enables seamless communication between users with a modern, responsive interface.",
    tech: ["React  ", "TypeScript", "Tailwind CSS", "Framer Motion","webTrc","Firebase",],
    gradient: "from-fuchsia-500/40 to-blue-500/30",
  },
];

export const SERVICES = [
   {
    title: "React Development",
    detail: "Modern, scalable React applications with clean architecture and responsive UI.",
  },
  {
    title: "React Native Apps",
    detail: "Cross-platform mobile apps for Android and iOS with smooth performance.",
  },
  {
    title: "Web Development",
    detail: "Fast, responsive, and interactive websites built with modern frontend technologies.",
  },
  {
    title: "Figma to Code",
    detail: "Convert Figma designs into pixel-perfect, responsive, and production-ready applications.",
  },
];

export const TESTIMONIALS = [
   {
    quote:
      "Outstanding attention to detail and exceptional frontend skills. The final product was responsive, visually polished, and delivered with clean, maintainable code.",
  },
  {
    quote:
      "The React application exceeded expectations with its smooth performance, intuitive user experience, and pixel-perfect implementation from the design.",
  },
  {
    quote:
      "Professional, reliable, and highly skilled. Every feature was implemented efficiently, and communication throughout the project was excellent.",
  },
];
